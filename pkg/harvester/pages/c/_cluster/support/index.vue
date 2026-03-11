<script>
import { mapGetters } from 'vuex';
import { PLUGIN_DEVELOPER, DEV } from '@shell/store/prefs';
import BannerGraphic from '@shell/components/BannerGraphic';
import IndentedPanel from '@shell/components/IndentedPanel';
import CommunityLinks from '@shell/components/CommunityLinks';
import { SCHEMA } from '@shell/config/types';
import HarvesterSupportBundle from '../../../../dialog/HarvesterSupportBundle';
import { HCI } from '../../../../types';
import { DOC } from '../../../../config/doc-links';
import { docLink } from '../../../../utils/feature-flags';

export default {
  components: {
    BannerGraphic,
    IndentedPanel,
    CommunityLinks,
    HarvesterSupportBundle
  },

  data() {
    return { options: { 'footer.docs': 'https://docs.harvesterhci.io' } };
  },

  computed: {
    ...mapGetters(['currentCluster']),

    dev() {
      try {
        return this.$store.getters['prefs/get'](PLUGIN_DEVELOPER);
      } catch {
        return this.$store.getters['prefs/get'](DEV);
      }
    },

    title() {
      return 'harvester.support.title';
    },

    showSupportBundle() {
      const inStore = this.$store.getters['currentProduct'].inStore;

      return !!this.$store.getters[`${ inStore }/byId`](
        SCHEMA,
        HCI.SUPPORT_BUNDLE
      );
    },

    internalPrefix() {
      const host = window.location.host;
      const prefix = window.location.pathname.replace(this.$route.path, '');
      const params = this.$route?.params;

      return {
        host, prefix, params
      };
    },

    rancherLink() {
      const { host, prefix, params } = this.internalPrefix;

      return `https://${ host }${ prefix }/c/${ params.cluster }/explorer`;
    },

    longhornLink() {
      const { host, params } = this.internalPrefix;

      return `https://${ host }/k8s/clusters/${ params.cluster }/api/v1/namespaces/longhorn-system/services/http:longhorn-frontend:80/proxy/#/dashboard`;
    },

    rancherIntegrationLink() {
      const version = this.$store.getters['harvester-common/getServerVersion']();

      return docLink(DOC.RANCHER_INTEGRATION_URL, version);
    },
  },

  methods: {
    open() {
      this.$store.commit('harvester-common/toggleBundleModal', true);
    },

  }
};
</script>

<template>
  <div>
    <div class="skylus-banner">
      <img src="../../../../assets/skylus-banner.svg" />
      <h1>{{ t(title, {}, true) }}</h1>
    </div>

    <IndentedPanel>
      <div class="content mt-20">
        <div class="promo">
          <div
            v-if="showSupportBundle"
            class="box mb-20 box-primary"
          >
            <h2>
              {{ t('harvester.modal.bundle.title') }}
            </h2>
            <div>
              <p class="pb-10">
                {{ t('harvester.modal.bundle.titleDescription') }}
              </p>
              <button
                class="btn role-secondary btn-sm"
                type="button"
                @click="open"
              >
                {{ t('harvester.modal.bundle.title') }}
              </button>
            </div>
          </div>
          <div
            class="box box-primary"
            :class="{'mb-20': dev }"
          >
            <h2>
              {{ t('harvester.support.kubeconfig.title') }}
            </h2>
            <div>
              <p class="pb-10">
                {{ t('harvester.support.kubeconfig.titleDescription') }}
              </p>
              <button
                class="btn role-secondary btn-sm"
                type="button"
                @click="currentCluster.downloadKubeConfig()"
              >
                {{ t('harvester.support.kubeconfig.title') }}
              </button>
            </div>
          </div>
          <div
            v-if="dev"
            class="row"
          >
            <div class="col span-6 box box-primary">
              <h2>
                <a
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  :href="rancherLink"
                >{{ t('harvester.support.internal.rancher.title') }} <i class="icon icon-external-link" /></a>
              </h2>
              <div>
                <p class="warning">
                  <t
                    k="harvester.support.internal.rancher.titleDescription"
                    :raw="true"
                    :url="rancherIntegrationLink"
                  />
                </p>
              </div>
            </div>
            <div class="col span-6 box box-primary">
              <h2>
                <a
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                  :href="longhornLink"
                >{{ t('harvester.support.internal.longhorn.title') }} <i class="icon icon-external-link" /></a>
              </h2>
              <div>
                <p class="warning">
                  <t
                    k="harvester.support.internal.longhorn.titleDescription"
                    :raw="true"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="community">
          <CommunityLinks :link-options="options" />
        </div>
      </div>
    </IndentedPanel>
    <HarvesterSupportBundle v-if="showSupportBundle" />
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  grid-template-columns: 70% 30%;
}

.only-community {
  display: grid;
  grid-template-columns: 100%;
}

.community {
  border-left: 1px solid var(--border);
  padding-left: 20px;
  > h2 {
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 20px;
  }
  .support-link {
    margin: 10px 0;
  }
}

.box {
  padding: 20px;
  border: 1px solid var(--border);

  &.box-primary {
    border-color: var(--primary);
  }

  > h2 {
    font-size: 20px;
    font-weight: 300;
  }

  > div {
    font-weight: 300;
    line-height: 18px;
    opacity: 0.8;
  }
}

.role-secondary {
  &:focus {
    background-color: transparent;
  }
}

.warning {
  margin: 0 -5px 0 -5px;
  padding: 5px;
  background-color: var(--warning-banner-bg);
}

.skylus-banner {
  position: relative;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  h1 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
  }
}
</style>
