<template>
  <v-parallax src="/map.svg" height="440">
    <v-container class="d-flex fill-height align-center justify-center">
      <v-row justify="center">
        <v-col cols="12" md="9" class="text-center">
          <v-card color="transparent" elevation="0">
            <v-card-title class="text-h3 font-weight-black text-wrap">
              Shit It Until You Make It
            </v-card-title>
            <v-card-subtitle class="text-h6 text-wrap mt-4">
              记录技术探索、实践经验与生活思考
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-parallax>

  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <v-row align="center" justify="space-between" class="mb-6">
          <v-col cols="12" sm="auto">
            <v-chip color="primary" variant="outlined" :prepend-icon="mdiPostOutline" class="mb-3">
              文章归档
            </v-chip>
            <v-card-title class="text-h4 font-weight-bold pa-0">最近更新</v-card-title>
            <v-card-subtitle class="text-body-1 pa-0 mt-2">持续记录值得分享的知识与经验</v-card-subtitle>
          </v-col>
          <v-col cols="12" sm="auto">
            <v-chip variant="outlined" :prepend-icon="mdiBookOpenPageVariantOutline">
              共 {{ summary.length }} 篇
            </v-chip>
          </v-col>
        </v-row>

        <v-empty-state
          v-if="summary.length === 0"
          title="暂无文章"
          text="新的内容正在准备中"
          :icon="mdiPostOutline"
        ></v-empty-state>

        <v-timeline v-else density="comfortable" side="end" align="start" truncate-line="both">
          <v-timeline-item
            v-for="article in summary"
            :key="article.url"
            width="100%"
            size="small"
            dot-color="primary"
          >
            <template #opposite>
              <v-chip class="d-none d-md-flex" variant="outlined" color="primary"
                :prepend-icon="mdiCalendarMonth">
                {{ article.formattedDate }}
              </v-chip>
            </template>

            <v-row no-gutters>
              <v-col cols="12">
                <v-card width="100%" rounded="xl" elevation="3">
                  <v-card-title class="text-h6 font-weight-bold text-wrap px-5 pt-5 pb-1">
                    {{ article.title }}
                  </v-card-title>
                  <v-card-subtitle class="d-flex d-md-none align-center ga-2 px-5">
                    <v-icon :icon="mdiCalendarMonth" size="small"></v-icon>
                    {{ article.formattedDate }}
                  </v-card-subtitle>
                  <v-card-text class="px-5 py-2">
                    {{ article.excerpt }}
                  </v-card-text>
                  <v-card-actions class="px-5 pt-0 pb-3">
                    <v-btn
                      variant="text"
                      color="primary"
                      :append-icon="mdiArrowRight"
                      @click="router.go(article.url)"
                    >
                      阅读全文
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vitepress'
import {
  mdiArrowRight,
  mdiBookOpenPageVariantOutline,
  mdiCalendarMonth,
  mdiPostOutline
} from '@mdi/js'
import { data as summary } from '../composable/post.data'

const router = useRouter()
</script>
