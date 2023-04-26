export function getNodeTypeName(nodeType) {
  const nodeTypeMap = {
    1: 'xray',
    2: 'trojan-go',
    3: 'hysteria',
    4: 'naiveproxy'
  }
  return nodeTypeMap[nodeType]
}

export function isXray(temp) {
  return getNodeTypeName(temp.nodeTypeId) === 'xray'
}

export function isTrojanGo(temp) {
  return getNodeTypeName(temp.nodeTypeId) === 'trojan-go'
}

export function isHysteria(temp) {
  return getNodeTypeName(temp.nodeTypeId) === 'hysteria'
}

export function isNaiveProxy(temp) {
  return getNodeTypeName(temp.nodeTypeId) === 'naiveproxy'
}

export function isXrayVless(temp) {
  return this.isXray(temp) && temp.xrayProtocol === 'vless'
}

export function isXrayVmess(temp) {
  return this.isXray(temp) && temp.xrayProtocol === 'vmess'
}

export function isXrayTrojan(temp) {
  return this.isXray(temp) && temp.xrayProtocol === 'trojan'
}

export function isXrayShadowsocks(temp) {
  return this.isXray(temp) && temp.xrayProtocol === 'shadowsocks'
}

export function isXrayWs(temp) {
  return this.isXray(temp) && temp.xrayStreamSettingsEntity.network === 'ws'
}

export function showXrayFlow(temp) {
  return (
    this.isXrayVless(temp) &&
    (temp.xrayStreamSettingsEntity.security === 'tls' ||
      temp.xrayStreamSettingsEntity.security === 'reality')
  )
}

export function showFallback(temp) {
  return (
    this.isXray(temp) &&
    (temp.xrayProtocol === 'vless' || temp.xrayProtocol === 'trojan') &&
    temp.xrayStreamSettingsEntity.network === 'tcp' &&
    temp.xrayStreamSettingsEntity.security === 'tls'
  )
}

export function isTrojanGoEnableWebsocket(temp) {
  return this.isTrojanGo(temp) && temp.trojanGoWebsocketEnable === 1
}

export function isTrojanGoEnableSs(temp) {
  return this.isTrojanGo(temp) && temp.trojanGoSsEnable === 1
}

export function nodeTypeComputed(nodeTypeId) {
  let nodeType = this.nodeTypes.find((item) => item.id === nodeTypeId)
  if (nodeType && nodeType.name) {
    return nodeType.name
  }
  return ''
}

export function nodeServerComputed(nodeServerId) {
  let nodeServer = this.nodeServers.find((item) => item.id === nodeServerId)
  if (nodeServer && nodeServer.name) {
    return nodeServer.name
  } else {
    return ''
  }
}