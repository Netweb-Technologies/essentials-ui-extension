<script>
import { LabeledInput } from '@components/Form/LabeledInput';
import ColorInput from '@shell/components/form/ColorInput';
import TypeDescription from '@shell/components/TypeDescription';
import { Checkbox } from '@components/Form/Checkbox';
import FileSelector from '@shell/components/form/FileSelector';
import SimpleBox from '@shell/components/SimpleBox';
import Loading from '@shell/components/Loading';
import AsyncButton from '@shell/components/AsyncButton';
import { Banner } from '@components/Banner';
import { allHash } from '@shell/utils/promise';
import { MANAGEMENT } from '@shell/config/types';
import { getVendor, setVendor } from '@shell/config/private-label';
import { fetchOrCreateSetting } from '@shell/utils/settings';
import { SETTING } from '@shell/config/settings';
import { _EDIT, _VIEW } from '@shell/config/query-params';
import { setFavIcon } from '@shell/utils/favicon';
const Color = require('color');

export default {
  components: {
    LabeledInput, Checkbox, FileSelector, Loading, SimpleBox, AsyncButton, Banner, ColorInput, TypeDescription
  },
//   async fetch() {
//   // comment everything OR leave empty

//   // HARD OVERRIDE
//   this.uiPLSetting = { value: 'Skylus Essentials' };
//   this.uiLogoDark = '/img/dark-logo.png';
//   this.uiLogoLight = '/img/light-logo.png';
//   this.uiFavicon = '/img/favicon.ico';
//   this.uiColor = '#0f62fe';
//   this.uiLinkColor = '#0f62fe';

//   this.customizeLogo = true;
//   this.customizeFavicon = true;
//   this.customizeColor = true;
//   this.customizeLinkColor = true;
// },
  data() {
    return {
      vendor: 'Skylus Essentials',   // hardcoded
      uiPLSetting: { value: 'Skylus Essentials' },

      uiLogoDark: '/img/dark-logo.png',
      uiLogoLight: '/img/light-logo.png',
      customizeLogo: true,

      uiFavicon: '/img/favicon.ico',
      customizeFavicon: true,

      uiColor: '#0f62fe',
      customizeColor: true,

      uiLinkColor: '#0f62fe',
      customizeLinkColor: true,

      errors: [],
    };
  },
  computed: {
    mode() {
      const schema = this.$store.getters[`management/schemaFor`](MANAGEMENT.SETTING);

      return schema?.resourceMethods?.includes('PUT') ? _EDIT : _VIEW;
      return 'edit';
    },
    customLinkColor() {
      return { color: this.uiLinkColor };
    }
  },
  mounted() {
    let uiColor = getComputedStyle(document.body).getPropertyValue('--primary');
    let uiLinkColor = getComputedStyle(document.body).getPropertyValue('--link');
    const suse = document.querySelector('.suse');

    if (suse) {
      uiColor = getComputedStyle(suse).getPropertyValue('--primary');
      uiLinkColor = getComputedStyle(suse).getPropertyValue('--link');
    }
    // Only set the color to the default if not already set from the custom color
    this.uiColor = '#0f62fe';
    this.uiLinkColor = '#0f62fe';
    setVendor(this.uiPLSetting.value);
    setFavIcon(this.$store);
  },
  methods: {
    updateLogo(img, key) {
      this[key] = img;
    },
    setError(e) {
      this.errors = [];
      this.errors.push(e);
    },
    async save(btnCB) {
  console.log('Hardcoded mode - nothing to save');

  // Optional: still apply vendor + favicon
  setVendor(this.uiPLSetting.value);
  setFavIcon(this.$store);

  btnCB(true);
    }
  }
};
</script>
<template>
  <Loading v-if="false" />
  <div v-else>
    <h1 class="mb-20">
      {{ t('branding.label') }}
    </h1>
    <TypeDescription resource="Skylus Essentials" />
    <div>
      <div class="row mb-20">
        <div class="col span-6">
          <LabeledInput
            v-model:value="uiPLSetting.value"
            :label="t('branding.uiPL.label')"
            :mode="mode"
            :maxlength="100"
          />
        </div>
      </div>
      <h3 class="mt-20 mb-5 pb-5">
        {{ t('branding.logos.label') }}
      </h3>
      <label class="text-label">
        {{ t('harvester.branding.logos.tip', {}, true) }}
      </label>
      <div class="row mt-10 mb-20">
        <Checkbox
          v-model:value="customizeLogo"
          :label="t('branding.logos.useCustom')"
          :mode="mode"
        />
      </div>
      <div
        v-if="customizeLogo"
        class="row mb-20"
      >
        <div class="col logo-container span-6">
          <div class="mb-10">
            <FileSelector
              :byte-limit="20000"
              :read-as-data-url="true"
              class="role-secondary"
              :label="t('branding.logos.uploadLight')"
              :mode="mode"
              @error="setError"
              @selected="updateLogo($event, 'uiLogoLight')"
            />
          </div>
          <SimpleBox
            v-if="uiLogoLight || uiLogoDark"
            class="theme-light  mb-10"
          >
            <label class="text-muted">{{ t('branding.logos.lightPreview') }}</label>
            <img
              class="logo-preview"
              :src="uiLogoLight ? uiLogoLight : uiLogoDark"
            >
          </SimpleBox>
        </div>
        <div class="col logo-container span-6">
          <div class="mb-10">
            <FileSelector
              :byte-limit="20000"
              :read-as-data-url="true"
              class="role-secondary"
              :label="t('branding.logos.uploadDark')"
              :mode="mode"
              @error="setError"
              @selected="updateLogo($event, 'uiLogoDark')"
            />
          </div>
          <SimpleBox
            v-if="uiLogoDark || uiLogoLight"
            class="theme-dark  mb-10"
          >
            <label class="text-muted">{{ t('branding.logos.darkPreview') }}</label>
            <img
              class="logo-preview"
              :src="uiLogoDark ? uiLogoDark : uiLogoLight"
            >
          </SimpleBox>
        </div>
      </div>
      <h3 class="mt-20 mb-5 pb-5">
        {{ t('branding.favicon.label') }}
      </h3>
      <label class="text-label">
        {{ t('harvester.branding.favicon.tip', {}, true) }}
      </label>
      <div class="row mt-10 mb-20">
        <Checkbox
          v-model:value="customizeFavicon"
          :label="t('branding.favicon.useCustom')"
          :mode="mode"
        />
      </div>
      <div
        v-if="customizeFavicon"
        class="row mb-20"
      >
        <div class="col logo-container span-12">
          <div class="mb-10">
            <FileSelector
              :byte-limit="20000"
              :read-as-data-url="true"
              class="role-secondary"
              :label="t('branding.favicon.upload')"
              :mode="mode"
              @error="setError"
              @selected="updateLogo($event, 'uiFavicon')"
            />
          </div>
          <SimpleBox v-if="uiFavicon">
            <label class="text-muted">{{ t('branding.favicon.preview') }}</label>
            <img
              class="logo-preview"
              :src="uiFavicon"
            >
          </SimpleBox>
        </div>
      </div>
      <h3 class="mt-40 mb-5 pb-0">
        {{ t('branding.color.label') }}
      </h3>
      <label class="text-label">
        {{ t('branding.color.tip', {}, true) }}
      </label>
      <div class="row mt-20">
        <Checkbox
          v-model:value="customizeColor"
          :label="t('branding.color.useCustom')"
          :mode="mode"
        />
      </div>
      <div
        v-if="customizeColor"
        class="row mt-20 mb-20"
      >
        <ColorInput
          v-model:value="uiColor"
          component-testid="primary"
        />
      </div>
      <h3 class="mt-40 mb-5 pb-0">
        {{ t('branding.linkColor.label') }}
      </h3>
      <label class="text-label">
        {{ t('branding.linkColor.tip', {}, true) }}
      </label>
      <div class="row mt-20">
        <Checkbox
          v-model:value="customizeLinkColor"
          :label="t('branding.linkColor.useCustom')"
          :mode="mode"
        />
      </div>
      <div
        v-if="customizeLinkColor"
        class="row mt-20 mb-20"
      >
        <ColorInput
          v-model:value="uiLinkColor"
          class="col"
          component-testid="link"
        />
        <span class="col link-example">
          <a :style="customLinkColor">
            {{ t('branding.linkColor.example') }}
          </a>
        </span>
      </div>
    </div>
    <template
      v-for="(err, i) in errors"
      :key="i"
    >
      <Banner
        color="error"
        :label="err"
      />
    </template>
    <div v-if="mode === 'edit'">
      <AsyncButton
        component-testid="branding-apply"
        class="pull-right mt-20"
        mode="apply"
        @click="save"
      />
    </div>
  </div>
</template>

  <style scoped lang='scss'>
  .link-example {
    display: flex;
    align-content: center;
    a {
      margin: auto;
    }
  }
  .logo-container {
      display: flex;
      flex-direction: column;
      :deep().simple-box {
          position: relative;
          flex: 1;
          max-height: 120px;
          .content {
            height: 100%;
            display: flex;
          }
          .logo-preview {
            max-width: 100%;
          }
      }
      & LABEL {
        position: absolute;
        top: 10px;
        left: 10px;
      }
  }
  </style>
