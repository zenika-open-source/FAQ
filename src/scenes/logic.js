import { logic as homeLogic } from './Home/logic'
import { logic as newLogic } from './New/logic'

export const logic = [...homeLogic, ...newLogic]
