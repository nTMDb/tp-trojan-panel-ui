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
  return isXray(temp) && temp.xrayProtocol === 'vless'
}

export function isXrayVmess(temp) {
  return isXray(temp) && temp.xrayProtocol === 'vmess'
}

export function isXrayTrojan(temp) {
  return isXray(temp) && temp.xrayProtocol === 'trojan'
}

export function isXrayShadowsocks(temp) {
  return isXray(temp) && temp.xrayProtocol === 'shadowsocks'
}

export function isXrayWs(temp) {
  return isXray(temp) && temp.xrayStreamSettingsEntity.network === 'ws'
}

export function showXrayFlow(temp) {
  return (
    isXrayVless(temp) &&
    (temp.xrayStreamSettingsEntity.security === 'tls' ||
      temp.xrayStreamSettingsEntity.security === 'reality')
  )
}

export function showFallback(temp) {
  return (
    isXray(temp) &&
    (temp.xrayProtocol === 'vless' || temp.xrayProtocol === 'trojan') &&
    temp.xrayStreamSettingsEntity.network === 'tcp' &&
    temp.xrayStreamSettingsEntity.security === 'tls'
  )
}

export function isTrojanGoEnableWebsocket(temp) {
  return isTrojanGo(temp) && temp.trojanGoWebsocketEnable === 1
}

export function isTrojanGoEnableSs(temp) {
  return isTrojanGo(temp) && temp.trojanGoSsEnable === 1
}

export function nodeTypeFind(nodeTypes, nodeTypeId) {
  let nodeType = nodeTypes.find((item) => item.id === nodeTypeId)
  if (nodeType && nodeType.name) {
    return nodeType.name
  }
  return ''
}

export function nodeServerFind(nodeServers, nodeServerId) {
  let nodeServer = nodeServers.find((item) => item.id === nodeServerId)
  if (nodeServer && nodeServer.name) {
    return nodeServer.name
  } else {
    return ''
  }
}

export function showUUID(temp) {
  return (
    isXray(temp) &&
    (temp.xrayProtocol === 'vless' || temp.xrayProtocol === 'vmess')
  )
}

export function showAlterId(temp) {
  return (
    isXray(temp) &&
    (temp.xrayProtocol === 'vless' || temp.xrayProtocol === 'vmess')
  )
}

export function isXrayStreamSettingsSecurityReality(temp) {
  return isXray(temp) && temp.xrayStreamSettingsEntity.security === 'reality'
}
