import ''

class A{
    a?: string
    b?: number
    c: B = new B()
    e: E = new E()
    f: M[] = [new M()]
    k: L[] = [new L()]
}

class B{
    a?: string
    b?: number
    c: E = new E()
}

class E{
    s?: string
    m: M = new M()
}

class M{
    r?: number
}

class L{
    r?: string
    m: M[] = [new M()]
    e: B = new B()
}
  
  function isClassInstance(obj: any): boolean {
    if (!obj) return false
  
    if (typeof obj === 'object' && obj.constructor) {
      return obj.constructor.name !== 'Object'
    }
    return false
  }
  
  function isArrayField(field: any): boolean {
    return Array.isArray(field)
  }
  
  function getArrayClass(arr: any[]): { new (): any } | undefined {
    if (arr.length === 0) {
      return undefined;
    }
  
    const cls = arr[0].constructor;
  
    const allSameClass = arr.every(item => item instanceof cls);
    return allSameClass ? cls : undefined;
  }
  
  export function dataMapping<T>(cls: new () => T, data: any): T {
    const instance = new cls()
    Object.getOwnPropertyNames(instance).forEach((key) => {
      if (key in data) {
        const field = (instance as any)[key]
        if (isArrayField(data[key])) {
          const arrayItemType = getArrayClass(field)
          if (arrayItemType) {
            ;(instance as any)[key] = data[key].map((val: typeof arrayItemType) => dataMapping(arrayItemType, val))
          } else {
            ;(instance as any)[key] = data[key]
          }
        }
        else if (isClassInstance(field)) {
          ;(instance as any)[key] = dataMapping(field.constructor, data[key])
        } 
        else {
          ;(instance as any)[key] = data[key]
        }
      }
    })
    return instance
  }


const data = {
    a: 'string a',
    b: 777,
    t: 89,
    c: {
        a: 'string ca',
        b: 77,
        c: {
            s: 'string cac',
            m: {
                r: 7
            }
        }
    },
    e: {
        s: 666,
        m: {
            r: 66
        }
    },
    f: [{
            r: 55,
            ron: 456
        },
        {
            r: 44
        }
    ],
    k: [
        {
            r: 33,
            m: [
                {
                    r: 22
                },
                {
                    r: 11
                }
            ],
            e: {
                b: -11,
                c: {
                    s: 'string kec',
                    m: {
                        r: -22
                    }
                }
            }
        }
    ]
}

dataMapping(A, data)
console.log(dataMapping(A, data))
