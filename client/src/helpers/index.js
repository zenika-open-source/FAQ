export * from './history'
export * from './onListChange'
export * from './url'
export { default as useClickOutside } from './useClickOutside'
export { default as useDebouncedText } from './useDebouncedText'
export { default as useDidMount } from './useDidMount'

export const isUuidV4 = str =>
  !!str.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
