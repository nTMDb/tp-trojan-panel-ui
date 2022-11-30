export function getNodeTypeName(nodeType) {
  const nodeTypeMap = {
    1: 'xray',
    2: 'trojan-go',
    3: 'hysteria',
    4: 'naiveproxy'
  }
  return nodeTypeMap[nodeType]
}

// 测试延迟
export function pingIp(ip) {
  let p = new Ping(null)
  p.ping(ip, function (err, data) {
    if (err) {
      return -1
    }
    return data
  })
}
