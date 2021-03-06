var o = require("ospec")
var lib = require('../lib')

o.spec('String', function(){
  o('split', function(){
    var result = lib.compileAndRun(`
      "hello there"
      Str.split(_, " ")
    `)
    o(result).deepEquals(["hello", "there"])
  })

  o('upcase', function(){
    var result = lib.compileAndRun(`"hi" Str.upcase(_)`)
    o(result).deepEquals('HI')
  })

  o('cap', function(){
    var result = lib.compileAndRun(`"hi" Str.cap(_)`)
    o(result).deepEquals('Hi')
  })

  o('toNum', function(){
    var result = lib.compileAndRun(`"10" Str.toNum(_, Num.spec(0,20))`)
    o(result).deepEquals(['Yes', 10])

    var result = lib.compileAndRun(`"-5" Str.toNum(_, Num.spec(0,20))`)
    o(result).deepEquals(['No'])

    var result = lib.compileAndRun(`"30" Str.toNum(_, Num.spec(0,20))`)
    o(result).deepEquals(['No'])

    var result = lib.compileAndRun(`"not a num" Str.toNum(_, Num.spec(0,20))`)
    o(result).deepEquals(['No'])
  })

  o('toNumBounded', function(){
    var result = lib.compileAndRun(`"10" Str.toNumBounded(_, Num.spec(0,20))`)
    o(result).deepEquals(['Yes', 10])

    var result = lib.compileAndRun(`"-5" Str.toNumBounded(_, Num.spec(0,20))`)
    o(result).deepEquals(['Yes', 0])

    var result = lib.compileAndRun(`"30" Str.toNumBounded(_, Num.spec(0,20))`)
    o(result).deepEquals(['Yes', 20])

    var result = lib.compileAndRun(`"not a num" Str.toNumBounded(_, Num.spec(0,20))`)
    o(result).deepEquals(['No'])
  })
})


o.spec('Num', function(){
  o('add', function(){
    var result = lib.compileAndRun(`10 Num.add(15,_)`)
    o(result).equals(25)
  })

  o('eq', function(){
    var result = lib.compileAndRun(`Num.eq(10, 15)`)
    o(result).equals(false)

    var result = lib.compileAndRun(`Num.eq(15, 15)`)
    o(result).equals(true)
  })
})


o.spec('Arr', function(){
  o('get', function(){
    var result = lib.compileAndRun(`@Arr(10,20) Arr.get(_,1)`)
    o(result).equals(20)
  })
  o('map', function(){
    var result = lib.compileAndRun(`@Arr(10,20) Arr.map(_,[Num.add(1,_)])`)
    o(result).deepEquals([11,21])
  })
})


o.spec('Tup', function(){
  o('get', function(){
    var result = lib.compileAndRun(`@Tup("x", 20) Tup.get(_,0)`)
    o(result).equals('x')

    var result = lib.compileAndRun(`@Tup("x", 20, 30) Tup.get(_,1)`)
    o(result).equals(20)
  })
})


o.spec('branches.Program', function(){
  o('exit', function(){
    var result = lib.compileAndRun(`
      10
      @branch Program.exit("adios", 20)
      30
    `)
    o(result).deepEquals(20)
  })
})


o.spec('Maybe', function(){
  o('unwrap!', function(){
    var result = lib.compileAndRun(`
      Str.toNum("5", Num.spec(5,5))
      Maybe.unwrap!(_, [
        @branch Program.exit("didn't work", 1)
      ])
    `)
    o(result).deepEquals(5)
  })

  o('unwrap! early exit', function(){
    var result = lib.compileAndRun(`
      Str.toNum("not a num", Num.spec(10,20))
      Maybe.unwrap!(_, [
        @branch Program.exit("not a num", 1)
      ])
      999
    `)
    o(result).deepEquals(1)
  })
})


o.spec('IO', function(){
  o('log', function(){
    var result = lib.compileAndRun(`IO.log("5", 10, @Arr(15))`)
    o(result).deepEquals(undefined)
  })
})
