open DepTypeUtil;

let stdtypes = [("Maybe",1)];
let ann = (source) => TypeAnn.compile(stdtypes, source);

let stdlib = T.{
  modules: [
    Module("Str", [
      FnDef("split", ann("(Str[0:s1], Str[1:s2]) => Arr[1:s1+1](Str[0:s1])")),
      FnDef("upcase", ann("(Str[0:n]) => Str[0:n]")),
      FnDef("cap", ann("(Str[0:n]) => Str[0:n]")),
      FnDef("toNum", ann("(Str[0:n], NumSpec[min:max]) => Maybe(Num[min:max])")),
      FnDef("toNumBounded", ann("(Str[0:n], NumSpec[min:max]) => Maybe(Num[min:max])")),
    ]),
    Module("Num", [
      FnDef("spec", def("Num.spec",
        [arity(2), requireConstNum(0), requireConstNum(1)],
        ((ctx, args)) => switch (args) {
        | [Num(Range(min, _)), Num(Range(max, _))] =>
          (ctx, TypeSpec(NumSpec(Range(min, max))))
        | _ => raise(TypeError("Unreachable."))
        })
      ),
      FnDef("add", ann("(Num[x1:y1], Num[x2:y2]) => Num[x1+x2:y1+y2]")),
      FnDef("eq", ann("(Num[x1:y1], Num[x2:y2]) => Bool")),
    ]),
    Module("Arr", [
      FnDef("get", ann("(Arr[1:n](itemType), Num[0:n-1]) => itemType")),
      FnDef("map", ann("(Arr[n:m](a), Block(a,b)) => Arr[n:m](b)")),
    ]),
    Module("Tup", [
      FnDef("get", def("Tup.get",
        [arity(2), requireConstNum(1)],
        ((ctx, args)) => switch (args) {
        | [Tup(tys), Num(Range(RangeVal(ConstNum(n)), _))] =>
          if (n >= Array.length(tys)) {
            raise(TypeError("Cannot get index " ++ string_of_int(n) ++ " of " ++ print(Tup(tys))))
          }
          else if ( n < 0 ) {
            raise(TypeError("Invalid tuple index: " ++ string_of_int(n)))
          }
          else {
            (ctx, Array.get(tys, n))
          }
        | _ => raise(TypeError("Unreachable."))
        })
      ),
    ]),
    Module("IO", [
      FnDef("log", DepType("IO.log", ((ctx, args)) => switch (args |> List.length) {
      | 0 => raise(TypeError("IO.log requires at least one argument"))
      | _ => (ctx, Void)
      }))
    ]),
    Module("Maybe", [
      FnDef("unwrap!", ann("(Maybe(ty), BranchBlock(void)) => ty")),
    ]),
  ],

  branches: [
    Module("Program", [
      BranchDef("exit", {
        let s = Str(Range(RangeVal(ConstNum(0)), RangeValMax));
        let n = Num(makeRangeV(ConstNum(0), ConstNum(5000)));
        BasicFn([s, n], n)
      })
    ])
  ],

  stacks: [],
  branchPaths: [],
  availableBranchPaths: BranchPathSet.empty
};
