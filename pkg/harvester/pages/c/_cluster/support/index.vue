<script>
import { mapGetters } from 'vuex';
import { PLUGIN_DEVELOPER, DEV } from '@shell/store/prefs';
import IndentedPanel from '@shell/components/IndentedPanel';
import CommunityLinks from '@shell/components/CommunityLinks';
import { SCHEMA } from '@shell/config/types';
import HarvesterSupportBundle from '../../../../dialog/HarvesterSupportBundle';
import { HCI } from '../../../../types';
import { DOC } from '../../../../config/doc-links';
import { docLink } from '../../../../utils/feature-flags';

export default {
  components: {
    IndentedPanel,
    CommunityLinks,
    HarvesterSupportBundle
  },

  data() {
    return { options: { 'footer.docs': 'https://docs.netwebblr.com/docs/skylus-essentials/user-guide' } };
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

      return `https://${ host }/c/${ params.cluster }/explorer`;
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
  <div class="support-page">
    <!-- Header -->
    <div class="support-header">
      <div class="support-header__text">
        <h1 class="support-header__title">
          {{ t(title, {}, true) }}
        </h1>
        <p class="support-header__subtitle">
          {{ t('harvester.support.description', {}, true) || 'Tools and resources to help you troubleshoot, debug, and get the most out of Skylus Essentials.' }}
        </p>
      </div>
      <div class="support-header__illustration">
        <img src="../../../../assets/icon-support.png" alt="Support illustration" />
      </div>
    </div>

    <IndentedPanel>
      <div class="support-content">
        <!-- Main actions column -->
        <div class="support-main">
          <!-- Support Bundle Card -->
          <div
            v-if="showSupportBundle"
            class="action-card"
          >
            <div class="action-card__icon">
              <img src="../../../../assets/support_bundle.svg" alt="Bundle" />
            </div>
            <div class="action-card__body">
              <h2 class="action-card__title">
                {{ t('harvester.modal.bundle.title') }}
              </h2>
              <p class="action-card__description">
                {{ t('harvester.modal.bundle.titleDescription') }}
              </p>
              <button
                class="btn btn-primary btn-sm"
                type="button"
                @click="open"
              >
                {{ t('harvester.modal.bundle.title') }}
              </button>
            </div>
          </div>

          <!-- KubeConfig Card -->
          <div class="action-card">
            <div class="action-card__icon">
              <img src="../../../../assets/kubeconfig_download.svg" alt="Bundle" />
            </div>
            <div class="action-card__body">
              <h2 class="action-card__title">
                {{ t('harvester.support.kubeconfig.title') }}
              </h2>
              <p class="action-card__description">
                {{ t('harvester.support.kubeconfig.titleDescription') }}
              </p>
              <button
                class="btn btn-primary btn-sm"
                type="button"
                @click="currentCluster.downloadKubeConfig()"
              >
                {{ t('harvester.support.kubeconfig.title') }}
              </button>
            </div>
          </div>

          <!-- Developer-only: Rancher + Longhorn -->
          <div class="div-cards-head">
            <div v-if="dev" class="dev-cards">
              <div class="dev-card">
                <h2 class="dev-card__title">
                  <a
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    :href="rancherLink"
                  >
                    {{ t('harvester.support.internal.rancher.title') }}
                    <i class="icon icon-external-link" />
                  </a>
                </h2>
                <div class="dev-card__warning">
                  <t
                    k="harvester.support.internal.rancher.titleDescription"
                    :raw="true"
                    :url="rancherIntegrationLink"
                  />
                </div>
              </div>
              <div class="dev-card">
                <h2 class="dev-card__title">
                  <a
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    :href="longhornLink"
                  >
                    {{ t('harvester.support.internal.longhorn.title') }}
                    <i class="icon icon-external-link" />
                  </a>
                </h2>
                <div class="dev-card__warning">
                  <t
                    k="harvester.support.internal.longhorn.titleDescription"
                    :raw="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Links -->
        <div class="support-sidebar">
          <div class="links-card">
            <div class="links-card__header">
              <div class="links-card__icon">
                <img src="../../../../assets/Link.svg" alt="Bundle" />
              </div>
              <span class="links-card__heading">{{ t('harvester.support.community.title', {}, true) || 'Links' }}</span>
            </div>
            <div class="links-card__body">
              <CommunityLinks :link-options="options" />
            </div>
          </div>
        </div>
      </div>
    </IndentedPanel>

    <HarvesterSupportBundle v-if="showSupportBundle" />
  </div>
</template>

<style lang="scss" scoped>
.support-page {
  background: var(--body-bg, #fff);
  min-height: 100vh;
}



/* ── Header ── */
.support-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36px 40px 28px;
  background: var(--body-bg, #f5f6fa);
  border-bottom: 1px solid var(--border, #e4e6eb);
  padding-right: 16%;

  &__text {
    flex: 1;
  }

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: var(--body-text, #1a1f36);
    margin: 0 0 8px;
  }

  &__subtitle {
    font-size: 16px;
    color: var(--muted, #6b7280);
    max-width: 75%;
    line-height: 1.6;
    margin: 0;
  }

  &__illustration {
    width: 280px;
    flex-shrink: 0;

    img {
      width: 280px;
      object-fit: contain;
    }
  }
}

/* ── Content grid ── */
.support-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
  padding: 24px 0;
}

/* ── Main action cards ── */
.support-main {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.action-card {
  background: var(--default-bg, #ffffff);
  border: 1px solid var(--border, #e4e6eb);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid var(--border, #e4e6eb);

  &:last-child {
    border-bottom: none;
  }

  &__icon {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img{
      width: 32px;
      object-fit: contain;
    }
  }

  &__body {
    flex: 1;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--body-text, #1a1f36);
    margin: 0 0 6px;
  }

  &__description {
    font-size: 14px;
    color: var(--muted, #6b7280);
    line-height: 1.5;
    margin: 0 0 14px;
  }
}

/* ── Dev cards (Rancher + Longhorn) ── */
.div-cards-head{
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--default-bg, #ffffff);
  border: 1px solid var(--border, #e4e6eb);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 32px;
}

.dev-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--border, #e4e6eb);
}

.dev-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  &:first-child {
    border-right: 1px solid var(--border, #e4e6eb);
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px;

    a {
      color: var(--body-text, #1a1f36);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;

      &:hover {
        color: var(--primary, #3b5ccc);
      }

      .icon {
        font-size: 14px;
        color: var(--primary, #3b5ccc);
      }
    }
  }

  &__warning {
    font-size: 14px;
    line-height: 1.5;
    padding: 10px 12px;
    background-color: var(--warning-banner-bg, #fffbeb);
    border-radius: 6px;
    color: var(--body-text, #1a1f36);
    align-items: stretch;
    flex-grow: 1;
  }
}

/* ── Sidebar ── */
.support-sidebar {
  display: flex;
  flex-direction: column;
}

.links-card {
  background: var(--default-bg, #ffffff);
  border: 1px solid var(--border, #e4e6eb);
  border-radius: 8px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border, #e4e6eb);
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;  /* Adjust size as needed */
      height: 20x;
      object-fit: contain;
  }
  }

  &__heading {
    font-size: 15px;
    font-weight: 600;
    color: var(--body-text, #1a1f36);
  }

  &__body {
    padding: 4px 0;
  }
}

/* ── Button overrides ── */
.btn-primary {
  background-color: var(--primary, #3b5ccc);
  border-color: var(--primary, #3b5ccc);
  color: #fff;
  font-weight: 500;
  font-size: 13px;
  border-radius: 6px;
  padding: 7px 16px;

  &:hover {
    background-color: var(--primary-hover, #2f4db5);
    border-color: var(--primary-hover, #2f4db5);
  }

  &:focus {
    background-color: var(--primary, #3b5ccc);
    outline: 2px solid var(--primary, #3b5ccc);
    outline-offset: 2px;
  }

}
</style>