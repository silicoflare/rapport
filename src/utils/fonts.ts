import { Montserrat, Turret_Road } from 'next/font/google'

const turr = Turret_Road({ subsets: ['latin'], weight: ["200", "300", "400", "500", "700", "800"] })
export const turretroad = turr.className

const mont = Montserrat({ subsets: ['latin'] })
export const montserrat = mont.className