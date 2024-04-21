type Rank = {
  id: string
  name: string
}

type BannerObject = {
  id: string
  title: string
  name: string
  imageUrl: string
}

type Banner = {
  id: string
  date: string
  banner: BannerObject
}

type User = {
  id: string
  discordId: null|number
  discordUserName: string
  discordGlobalName: null|string
  discordAvatar: null|string
  balance: null|number
  loreDust: null|number
  loreFragment: null|number
  upgradeDust: null|number
  rank: null|Rank
  userBanner: null|Banner
  isActive: boolean
  createdDate: null|string
}

export type AscensionUser = {
  user: User
  maxFloorIndex: number
  towerLogCount: number
  towerLogCountByFloor: number[]
}