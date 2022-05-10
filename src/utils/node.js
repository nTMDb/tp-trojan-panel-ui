export function getNodeTypeName(nodeType) {
  const nodeTypeMap = {
    1: 'trojan-go',
    2: 'hysteria'
  }
  return nodeTypeMap[nodeType]
}