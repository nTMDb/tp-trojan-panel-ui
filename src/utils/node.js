export function getNodeTypeName(nodeType) {
  const nodeTypeMap = {
    1: 'xray',
    2: 'trojan-go',
    3: 'hysteria'
  }
  return nodeTypeMap[nodeType]
}