// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Error404 from './component/Error404.vue'
import 'vuetify/styles'
import {
  VAlert,
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VAutocomplete,
  VAvatar,
  VBreadcrumbs,
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VContainer,
  VDivider,
  VEmptyState,
  VFooter,
  VIcon,
  VImg,
  VList,
  VListGroup,
  VListItem,
  VListItemTitle,
  VListSubheader,
  VMain,
  VNavigationDrawer,
  VOverlay,
  VParallax,
  VProgressCircular,
  VProgressLinear,
  VRadio,
  VRadioGroup,
  VResponsive,
  VRow,
  VSheet,
  VSpacer,
  VSwitch,
  VTimeline,
  VTimelineItem
} from 'vuetify/components'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const vuetify = createVuetify({
  components: {
    VAlert,
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VAppBarTitle,
    VAutocomplete,
    VAvatar,
    VBreadcrumbs,
    VBtn,
    VCard,
    VCardActions,
    VCardSubtitle,
    VCardText,
    VCardTitle,
    VChip,
    VCol,
    VContainer,
    VDivider,
    VEmptyState,
    VFooter,
    VIcon,
    VImg,
    VList,
    VListGroup,
    VListItem,
    VListItemTitle,
    VListSubheader,
    VMain,
    VNavigationDrawer,
    VOverlay,
    VParallax,
    VProgressCircular,
    VProgressLinear,
    VRadio,
    VRadioGroup,
    VResponsive,
    VRow,
    VSheet,
    VSpacer,
    VSwitch,
    VTimeline,
    VTimelineItem
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})


export default {
  extends: DefaultTheme,
  Layout,
  NotFound: Error404,
  enhanceApp({ app }) {
    app.use(vuetify)
  },
} satisfies Theme
