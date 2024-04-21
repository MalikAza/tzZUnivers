import axios from "axios"
import { AscensionType } from "./apiResponses/leaderboards"
import { AscensionUser } from "./apiResponses/users"
import { UserInventoryObject } from "./apiResponses/items"

const API_BASE_URL = "https://zunivers-api.zerator.com/public"
const PLAYER_BASE_URL = "https://zunivers.zerator.com/joueur"

const ADVENT_INDEX = {
  "1*": 1,
  "2*": 2,
  "ticket": 3,
  "dust": 4,
  "fragment": 5,
  "balance": 6,
  "1*+": 7,
  "3*": 8,
  "banner": 9,
  "2*+": 10,
  "3*+": 11,
  "4*": 12,
  "4*+": 13
}

function toDateFormat(date: Date): string {
  return date.toISOString().split('T')[0]
}

function toDateTimeFormat(date: Date): string {
  return date.toISOString().split('.')[0]
}

function toFullDateTimeFormat(date: Date): string {
  return date.toISOString()
}

function toDiscordDateFormat(date: Date): string {
  return date.toLocaleDateString('fr-FR').split(',').join('')
}

class ZUniversAPIError extends Error {
  url: string

  constructor(url: string) {
    super('Something went wrong on ZUnivers API.')
    this.url = url
  }

  toString(): string {
    return `${this.message} (EndPoint: ${this.url})`
  }
}

async function getDatas(url: string): Promise<any> {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    if (error.response && error.response.data) { throw new ZUniversAPIError(url)}
    else { throw error }
  }
}

async function postDatas(url: string): Promise<any> {
  try {
    const response = await axios.post(url)
    return response.data
  } catch (error) {
    if (error.response && error.response.data) { throw new ZUniversAPIError(url)}
    else { throw error }
  }
}

function parseUsername(username: string): [string, string] {
  username = username.replace('/(?:#0)$/', '') // remove suffix for retro-compatibility
  const parsedUsername = username ? encodeURIComponent(username) : ''
  
  return [username, parsedUsername]
}

function isAdventCalendar(): boolean {
  const parisTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  })

  const currentDate = new Date(parisTimeFormatter.format(new Date()))
  const currentYear = currentDate.getFullYear()
  const adventStartDate = new Date(parisTimeFormatter.format(new Date(Date.UTC(currentYear, 11, 1))))
  const adventEndDate = new Date(parisTimeFormatter.format(new Date(Date.UTC(currentYear, 11, 25))))

  return currentDate >= adventStartDate && currentDate <= adventEndDate
}

async function getAscensionLeaderboard(usernames: string[]): Promise<AscensionUser[]> {
  if (usernames.length === 1 && Array.isArray(usernames[0])) {
    usernames = usernames[0]
  }
  usernames = usernames.map(username => `&discordUserName=${parseUsername(username)[1]}`)
  const url = `${API_BASE_URL}/tower/leaderboard?seasonOffset=0${usernames.join('')}`

  const datas: AscensionType = await getDatas(url)
  const users = datas.users
  users.forEach(user => {
    if (!user.maxFloorIndex) user.maxFloorIndex = 0
    user.maxFloorIndex += 1
  })

  return users.sort((a, b) => {
    return a.maxFloorIndex - b.maxFloorIndex || b.towerLogCount - a.towerLogCount
  })
}

async function getInventory(username: string, search: string = ''): Promise<UserInventoryObject[]> {
  const url = `${API_BASE_URL}/inventory/${parseUsername(username)[1]}${search ? `?search=${search}` : ''}`

  return getDatas(url)
}

export {
  ADVENT_INDEX,
  API_BASE_URL,
  PLAYER_BASE_URL,
  toDateFormat,
  toDateTimeFormat,
  toFullDateTimeFormat,
  toDiscordDateFormat,
  getDatas,
  postDatas,
  parseUsername,
  getAscensionLeaderboard,
  getInventory,
  isAdventCalendar,
}