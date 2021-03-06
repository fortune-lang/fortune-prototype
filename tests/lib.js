var Ops = require('../src/compiler/ops.bs')
var Node = require('../src/runtimes/node')
var TypeAnn = require('../src/TypeAnn.bs')

exports.compileAndRun = (source, runtimeStack=[], opts={}) => {
  var [result, [branchPaths], [ast], [returnType], errMsg] = Node.parse(source, opts)

  if ( result === 'error' ) {
    throw new Error(errMsg)
  }

  if ( ! ast ) {
    throw new Error("AST failed to parse")
  }

  var ops = Ops.compileAst(ast)
  var program = {
    context: require('../src/runtimes/node').stdlib,
    ops: ops,
  }
  // console.log("Running program", require('util').inspect(program, { depth: 10 }))
  return Node.run(program, runtimeStack)
}

exports.getType = (source, opts={}) => {
  var [type, [branchPaths], [ast], [returnType], errMsg] = Node.parse(source, opts)
  if ( type === 'success' ) {
    return { type, branchPaths, errMsg, result: Ops.compileType(returnType) }
  }
  else {
    return { type, branchPaths, errMsg }
  }
}

exports.compileType = (typeAnn) => {
  var ty = TypeAnn.compile(typeAnn)
  return Ops.compileType(ty)
}
