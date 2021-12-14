<template>
  <div
    class="reddit-post pa-4 d-flex align-start justify-space-between"
    :class="{ full: showFullPost }"
  >
    <div class="flex-grow-1">
      <reddit-post-header
        :post="post"
        :show-sub-reddit-info="showSubRedditInfo"
      />
      <div class="text-h5 post-title">{{ post.title }}</div>
      <div class="post-body-container">
        <v-lazy
          class="d-flex align-start justify-center body-2 mt-3 post-body"
          :class="{ blurred: isBlurred }"
        >
          <v-fade-transition mode="out-in">
            <reddit-text-post
              v-if="postType === 'text'"
              key="text-post"
              :post-text="postText"
            />
            <iframe
              v-else-if="postType === 'embedded'"
              key="embedded-post"
              class="embedded-media"
              :src="secureEmbed.url"
              :width="secureEmbed.width"
              :height="secureEmbed.height"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer"
              scrolling="no"
            />
            <responsive-video
              v-else-if="postType === 'video'"
              key="video-post"
              :video="video"
              class="video-post"
            />
            <reddit-image-post
              v-else-if="postType === 'image'"
              key="image-post"
              :post="post"
              :show-full-post="showFullPost && !showPreview"
            />
            <div
              v-else-if="postType === 'link'"
              key="link-post"
              class="flex-grow-1 link-post"
            >
              <a
                :href="postUrl"
                class="caption d-flex align-center text-decoration-none"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="url">{{ displayUrl }}</span>
                <v-icon small color="info">open_in_new</v-icon>
              </a>
            </div>
            <v-sheet
              v-else-if="postType === 'cross-post'"
              key="cross-post"
              outlined
            >
              <router-link
                :to="{
                  name: 'post-view',
                  params: {
                    subreddit: parentPost.subreddit,
                    postId: parentPost.id,
                  },
                }"
                class="unstyled"
                :target="openPostInNewTab ? '_blank' : '_self'"
              >
                <reddit-post
                  :post="parentPost"
                  :show-parent-post="false"
                  :show-full-post="showFullPost"
                  :show-sub-reddit-info="true"
                />
              </router-link>
            </v-sheet>
          </v-fade-transition>
        </v-lazy>
        <v-fade-transition>
          <!-- Use an overlay here in case the post has a -->
          <!-- color that makes the text invisible-->
          <v-overlay
            v-if="isBlurred"
            absolute
            class="normal-cursor"
            @click.native.stop.prevent=""
          >
            <v-btn
              x-large
              tile
              outlined
              @click.stop.prevent="manualShowConfirmed = true"
            >
              Show {{ blurReason }}
            </v-btn>
          </v-overlay>
        </v-fade-transition>

        <v-overlay
          v-if="showPreview && !isBlurred"
          absolute
          @click.native.stop.prevent="manualPlayClicked = true"
        >
          <v-icon size="90">play_circle</v-icon>
        </v-overlay>
      </div>
    </div>
    <a
      v-if="thumbnail && postType === 'link' && postUrl"
      :href="postUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="d-none ml-4 mr-2 my-2 d-sm-flex justify-center align-center"
    >
      <responsive-image :source="thumbnail" class="post-thumbnail" />
    </a>
  </div>
</template>

<script>
import RedditPostHeader from "@/components/post/RedditPostHeader";
import ResponsiveImage from "@/components/ResponsiveImage";
import ResponsiveVideo from "@/components/ResponsiveVideo";
import appSettings from "@/lib/mixins/appSettings";
import RedditImagePost from "@/components/post/RedditImagePost";
import bestFit from "@/lib/mixins/bestFit";
import RedditTextPost from "@/components/post/RedditTextPost";

export default {
  name: "RedditPost",
  components: {
    RedditTextPost,
    RedditImagePost,
    ResponsiveImage,
    ResponsiveVideo,
    RedditPostHeader,
  },
  mixins: [appSettings, bestFit],
  props: {
    post: {
      type: Object,
      required: true,
    },
    showSubRedditInfo: {
      type: Boolean,
      required: false,
      default: true,
    },
    showFullPost: {
      type: Boolean,
      required: false,
      default: false,
    },
    showParentPost: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      // Some post will require manual confirmation to show,
      // e.g. spoilers and NSFW.
      manualShowConfirmed: false,
      manualPlayClicked: false,
    };
  },
  computed: {
    postType() {
      if (this.postText) return "text";
      if (this.secureEmbed && !this.showPreview) return "embedded";
      if (this.video && !this.showPreview) return "video";
      if (this.showImage) return "image";
      if (this.showParentPost && this.parentPost) return "cross-post";
      if (this.postUrl) return "link";
      return "empty";
    },
    isNSFW() {
      return !this.showNSFW && this.post.over_18;
    },
    isSpoiler() {
      return this.post.spoiler;
    },
    isBlurred() {
      return (
        !this.manualShowConfirmed &&
        (this.isSpoiler || this.isNSFW) &&
        this.postType !== "empty"
      );
    },
    blurReason() {
      if (this.isSpoiler) return "spoiler";
      if (this.isNSFW) return "nsfw";
      return "";
    },
    showPreview() {
      return (
        !this.autoplayMedia &&
        !this.manualPlayClicked &&
        this.showImage &&
        (this.video || this.secureEmbed)
      );
    },
    thumbnail() {
      if (
        !this.post.thumbnail ||
        this.post.thumbnail === "default" ||
        this.post.thumbnail === "self" ||
        !this.post.thumbnail_height ||
        !this.post.thumbnail_width
      )
        return;

      let url;
      try {
        // Make sure this is an URL and not some weird
        // Reddit thing.
        url = new URL(this.post.thumbnail);
      } catch (e) {
        return;
      }

      return {
        url: url.toString(),
        height: this.post.thumbnail_height,
        width: this.post.thumbnail_width,
      };
    },
    showImage() {
      // Text post maybe, no need to show an image for these?
      if (this.post.post_hint === "self") return false;
      // Only show thumbnail for links
      if (this.post.post_hint === "link" && !this.video && !this.secureEmbed)
        return false;

      // Various checks, because reddit is weird with this.
      if (this.post.post_hint === "image") return true;
      if (this.post.is_gallery) return true;
      if (this.post.media_metadata) return true;
      if (this.post.preview && this.post.preview.images) return true;
      if (
        this.post.is_reddit_media_domain &&
        this.post.url &&
        this.looksLikeImageUrl(this.post.url)
      )
        return true;
      return false;
    },
    secureEmbed() {
      if (
        !this.post.secure_media_embed ||
        !this.post.secure_media_embed.media_domain_url
      )
        return;

      const url = new URL(this.post.secure_media_embed.media_domain_url);
      // Mystery params from reddit
      url.searchParams.append("responsive", "true");
      url.searchParams.append("is_nightmode", this.darkTheme.toString());
      return {
        url: url.toString(),
        ...this.getBestFit({
          width: this.post.secure_media_embed.width,
          height: this.post.secure_media_embed.height,
        }),
      };
    },
    video() {
      const videoData =
        (this.post.secure_media && this.post.secure_media.reddit_video) ||
        (this.post.preview && this.post.preview.reddit_video_preview) ||
        (this.post.media && this.post.media.reddit_video);
      if (!videoData) return;

      return {
        ...videoData,
        ...this.getBestFit({
          width: videoData.width,
          height: videoData.height,
        }),
      };
    },
    parentPost() {
      return (
        this.showParentPost &&
        this.post.crosspost_parent &&
        this.post.crosspost_parent_list &&
        this.post.crosspost_parent_list.find(
          (parent) => parent.name === this.post.crosspost_parent
        )
      );
    },
    postUrl() {
      if (
        (this.post.post_hint && this.post.post_hint !== "link") ||
        this.post.is_self ||
        this.post.is_reddit_media_domain ||
        this.post.domain === "reddit.com"
      )
        return;
      return this.post.url || this.post.url_overridden_by_dest;
    },
    displayUrl() {
      if (!this.postUrl) return;
      let url;
      try {
        url = new URL(this.postUrl);
      } catch (e) {
        return this.postUrl;
      }
      const domain =
        (!this.post.is_self && this.post.domain) || url.host || url.hostname;

      let path = url.pathname.slice(0, 20);
      if (path.length < url.pathname.length) {
        path += "...";
      }
      return domain + path;
    },
    postText() {
      return this.post.selftext_html || this.post.selftext;
    },
  },
};
</script>

<style scoped lang="scss">
.reddit-post {
  cursor: pointer;
  overflow: hidden;
}

.post-body-container {
  position: relative;
  overflow: hidden;
}

.blurred {
  filter: blur(50px);
}

.post-thumbnail::v-deep {
  width: 7rem;
  height: 7rem;

  img {
    width: 7rem;
    height: 7rem;
    object-fit: cover;
  }
}

.video-post,
.image-post,
.embedded-media {
  max-height: 36rem;
}

.reddit-post.full {
  .text-post,
  .image-post {
    max-height: unset;
    mask-image: none;
  }
}

.post-title {
  word-break: break-word;
}

.post-body {
  position: relative;
  word-break: break-word;

  & > * {
    max-width: 100%;
  }
}
</style>
