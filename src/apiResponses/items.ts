import { Pack } from "./packs"

type Item = {
  id: string
  name: string
  slug: string
  genre: string
  rarity: number
  identifier: number
  description: null|string
  reference: null|string
  pack: Pack
  urls: string[]
  score: number
  scoreGolden: number
  isRecyclable: boolean
  isTradable: boolean
  isCounting: boolean
  isCraftable: boolean
  isInvocable: boolean
  isGoldable: boolean
  isUpgradable: boolean
}

type __ItemMoreInfos = {
  item: Item
  isGolden: boolean
  upgradeLevel: number
}

type InventoryObject = __ItemMoreInfos & {
  id: string
  quantity: number
}

export type UserInventoryObject = InventoryObject & {
  isFusion: boolean
  isFusionComponent: boolean
}