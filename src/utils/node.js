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

export function isXrayShadowsocksAEAD(temp) {
  return isXray(temp) && temp.xrayProtocol === 'shadowsocks-AEAD'
}

export function isXrayShadowsocks2022(temp) {
  return isXray(temp) && temp.xrayProtocol === 'shadowsocks-2022'
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
  return isXray(temp) && temp.xrayProtocol === 'vmess'
}

export function isXrayStreamSettingsSecurityTls(temp) {
  return (
    isXray(temp) &&
    temp.xrayStreamSettingsEntity.security === 'tls' &&
    !isXrayShadowsocks(temp)
  )
}

export function isXrayStreamSettingsSecurityReality(temp) {
  return (
    isXray(temp) &&
    temp.xrayStreamSettingsEntity.security === 'reality' &&
    !isXrayShadowsocks(temp)
  )
}

export function handleNodeDetail(nodeDetail, responseData) {
  nodeDetail.password = responseData.password
  if (nodeDetail.nodeTypeId === 1) {
    nodeDetail.xrayProtocol = responseData.xrayProtocol
    nodeDetail.xraySettings = responseData.xraySettings
    nodeDetail.xraySettingsEntity = Object.assign(
      nodeDetail.xraySettingsEntity,
      responseData.xraySettingsEntity
    )
    nodeDetail.xrayStreamSettingsEntity = Object.assign(
      nodeDetail.xrayStreamSettingsEntity,
      responseData.xrayStreamSettingsEntity
    )
    nodeDetail.xrayTag = responseData.xrayTag
    nodeDetail.xraySniffing = responseData.xraySniffing
    nodeDetail.xrayAllocate = responseData.xrayAllocate
    nodeDetail.uuid = responseData.uuid
    nodeDetail.alterId = responseData.alterId
    nodeDetail.xrayFlow = responseData.xrayFlow
    nodeDetail.xraySSMethod = responseData.xraySSMethod
  }
  if (nodeDetail.nodeTypeId === 2) {
    nodeDetail.trojanGoSni = responseData.trojanGoSni
    nodeDetail.trojanGoMuxEnable = responseData.trojanGoMuxEnable
    nodeDetail.trojanGoWebsocketEnable = responseData.trojanGoWebsocketEnable
    nodeDetail.trojanGoWebsocketPath = responseData.trojanGoWebsocketPath
    nodeDetail.trojanGoWebsocketHost = responseData.trojanGoWebsocketHost
    nodeDetail.trojanGoSsEnable = responseData.trojanGoSsEnable
    nodeDetail.trojanGoSsMethod = responseData.trojanGoSsMethod
    nodeDetail.trojanGoSsPassword = responseData.trojanGoSsPassword
  }
  if (nodeDetail.nodeTypeId === 3) {
    nodeDetail.hysteriaProtocol = responseData.hysteriaProtocol
    nodeDetail.hysteriaObfs = responseData.hysteriaObfs
    nodeDetail.hysteriaUpMbps = responseData.hysteriaUpMbps
    nodeDetail.hysteriaDownMbps = responseData.hysteriaDownMbps
  }
  if (nodeDetail.nodeTypeId === 4) {
    nodeDetail.naiveProxyUsername = responseData.naiveProxyUsername
  }
  return nodeDetail
}

export function handleNodeUpdate(temp, responseData) {
  if (temp.nodeTypeId === 1) {
    temp.xrayProtocol = responseData.xrayProtocol
    temp.xraySettings = responseData.xraySettings
    temp.xraySettingsEntity = Object.assign(
      temp.xraySettingsEntity,
      responseData.xraySettingsEntity
    )
    temp.xrayStreamSettingsEntity = Object.assign(
      temp.xrayStreamSettingsEntity,
      responseData.xrayStreamSettingsEntity
    )
    temp.xrayTag = responseData.xrayTag
    temp.xraySniffing = responseData.xraySniffing
    temp.xrayAllocate = responseData.xrayAllocate
  }
  if (temp.nodeTypeId === 2) {
    temp.trojanGoSni = responseData.trojanGoSni
    temp.trojanGoMuxEnable = responseData.trojanGoMuxEnable
    temp.trojanGoWebsocketEnable = responseData.trojanGoWebsocketEnable
    temp.trojanGoWebsocketPath = responseData.trojanGoWebsocketPath
    temp.trojanGoWebsocketHost = responseData.trojanGoWebsocketHost
    temp.trojanGoSsEnable = responseData.trojanGoSsEnable
    temp.trojanGoSsMethod = responseData.trojanGoSsMethod
    temp.trojanGoSsPassword = responseData.trojanGoSsPassword
  }
  if (temp.nodeTypeId === 3) {
    temp.hysteriaProtocol = responseData.hysteriaProtocol
    temp.hysteriaObfs = responseData.hysteriaObfs
    temp.hysteriaUpMbps = responseData.hysteriaUpMbps
    temp.hysteriaDownMbps = responseData.hysteriaDownMbps
  }
  return temp
}

export const fingerprints = [
  'chrome',
  'firefox',
  'safari',
  'ios',
  'android',
  'edge',
  '360',
  'qq',
  'random',
  'randomized'
]
