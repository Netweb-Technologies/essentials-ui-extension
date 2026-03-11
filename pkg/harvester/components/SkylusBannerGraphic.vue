<script>
import Closeable from '@shell/mixins/closeable';
import { MANAGEMENT } from '@shell/config/types';
import { SETTING } from '@shell/config/settings';
import { getBrandMeta } from '@shell/utils/brand';

export default {
  mixins: [Closeable],

  props: {
    title: {
      type:    String,
      default: null,
    },
    titleKey: {
      type:    String,
      default: null,
    },
  },

  data() {
    const globalSettings = this.$store.getters['management/all'](MANAGEMENT.SETTING);
    const setting = globalSettings?.find((gs) => gs.id === SETTING.BRAND);
    const brandMeta = getBrandMeta(setting?.value);
    const banner = brandMeta?.banner || {};
    const align = banner.textAlign || 'center';
    const bannerClass = banner.bannerClass || '';

    return { alignClass: `banner-text-${ align }`, bannerClass };
  }
};
</script>

<template>
  <div
    v-if="shown"
    class="banner-graphic-area"
    :class="{[alignClass]: true}"
  >
    <!-- TEST MESSAGE TO VERIFY OVERRIDE -->
    <h1 style="color:red; text-align:center;">
      SKYLUS BANNER ACTIVE
    </h1>

    <div
      :class="bannerClass"
      class="graphic banner-graphic-height"
    >
      <img
        class="banner"
        src="../assets/skylus-banner.svg"
        draggable="false"
      />
    </div>

    <div
      v-if="titleKey"
      data-testid="banner-title-key"
      class="title"
    >
      <t :k="titleKey" />
    </div>

    <h1
      v-else-if="title"
      v-clean-html="title"
      data-testid="banner-title"
      class="title"
    />
  </div>
</template>

<style lang="scss" scoped>
$banner-height: 200px;

.banner-graphic-area {
  position: relative;

  .graphic {
    display: flex;
    flex-direction: column;
    overflow: hidden;

    > img.banner {
      flex: 1;
      object-fit: cover;
    }
  }

  .title {
    display: flex;
    align-items: center;
    position: absolute;
    text-align: center;
    top: 0;
    height: 100%;
    width: 100%;
  }

  &.banner-text-center {
    .title {
      justify-content: center;
      margin-top: -20px;
    }
  }

  &.banner-text-left {
    .title {
      justify-content: left;
      padding-left: 20px;
    }
  }
}

.banner-graphic-height {
  height: var(--banner-graphic-height, $banner-height);
}
</style>
