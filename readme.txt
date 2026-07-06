=== Lax Block Binder ===
Contributors: lakshmananphp
Tags: block-bindings, blocks, gutenberg, post-meta, custom-fields
Requires at least: 6.5
Requires PHP: 7.4
Tested up to: 7.0
Stable tag: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Visually bind post meta to core blocks using the Block Bindings API.

== Description ==

Block Binder is a WordPress plugin that provides a user-friendly interface for binding post meta to supported core blocks using WordPress's Block Bindings API (available in WordPress 6.5+).

Instead of manually editing block HTML or writing custom code, editors can now:
- Select a supported block in the editor
- Choose which block attribute to bind (text, URL, image, etc.)
- Select a post meta key from the available options
- Click "Bind" to connect the meta value to the block attribute

The block will automatically display the post meta value on the frontend without hardcoding content.

== Features ==

* **Visual Block Binding Interface** — Sidebar panel for intuitive meta-to-block connections
* **16+ Supported Blocks** — Paragraph, Heading, Image, Button, List, Quote, Audio, Video, Columns, Cover, File, Gallery, Table, and more
* **Dynamic Meta Key Discovery** — Automatically discovers available post meta keys from your site
* **REST API Integration** — Asynchronous meta key loading for optimal performance
* **Block Bindings API Compliant** — Uses WordPress's official Block Bindings API (WP 6.5+)
* **Secure** — Respects WordPress security standards with capability checks and nonce verification

== Installation ==

1. Download the Block Binder plugin
2. Upload it to the `/wp-content/plugins/block-binder/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Edit any post/page in the block editor
5. Select a supported block and look for the "Block Binder" panel in the document settings (right sidebar)

== Usage ==

1. **Edit a Post/Page** — Open the WordPress block editor
2. **Select a Block** — Click on a supported block (Paragraph, Heading, Image, Button, etc.)
3. **Open Block Binder Panel** — Find the "Block Binder" panel in the document settings sidebar
4. **Choose Attribute** — Select which block attribute to bind (e.g., "content" for Paragraph, "url" for Image)
5. **Select Meta Key** — Choose a post meta key from the dropdown (dynamically populated from your site)
6. **Bind** — Click the "Bind" button to connect the meta value to the block attribute
7. **Unbind** — Click "Unbind" to remove an existing binding

On the frontend, the bound block attribute will automatically display the post meta value without requiring additional code.

== Supported Blocks ==

* core/paragraph
* core/heading (including h1-h6 variants)
* core/image
* core/button
* core/list
* core/quote
* core/audio
* core/video
* core/columns
* core/column
* core/cover
* core/file
* core/gallery
* core/table
* core/preformatted
* core/verse

== Block Attributes ==

Different blocks support different attributes:

* **Paragraph, Heading** — content
* **Image** — url, alt, title, caption
* **Button** — text, url, title
* **List** — values
* **Quote** — value, citation
* **Audio, Video** — src, caption
* **Columns, Column** — className
* **Cover** — backgroundImageUrl, title, subtitle
* **File** — href, fileName, textLinkTarget
* **Gallery, Table** — caption
* **Preformatted, Verse** — content

== Frequently Asked Questions ==

= What WordPress version do I need? =
Block Binder requires WordPress 6.5 or higher, as it depends on the Block Bindings API introduced in that version.

= What PHP version is required? =
PHP 7.4 or higher is required.

= Can I bind multiple attributes on the same block? =
Yes! You can bind multiple attributes on a single block to different post meta keys.

= Will the bound values appear on the frontend? =
Yes. WordPress's Block Bindings API automatically displays the bound post meta values on the frontend without requiring any additional code.

= Can I use custom post meta keys? =
Yes. Block Binder discovers meta keys from:
1. Meta keys registered via `register_meta()`
2. Meta keys found in your site's post meta

Any meta key in your database will appear in the dropdown.

= What if I have a lot of post meta? =
Block Binder queries the latest 50 posts to discover available meta keys, limiting the dropdown to relevant options for performance.

= Can I bind to private/underscored meta keys? =
Block Binder primarily shows public meta keys (those not starting with `_`). Private meta keys can still be bound via the block's metadata editor if needed.

= Is this secure? =
Yes. Block Binder respects WordPress security standards:
- Only users with `edit_posts` capability can access the binding interface
- REST API endpoints are secured with nonce verification
- All inputs are sanitized and validated

= Can I use this with custom blocks? =
Currently, Block Binder supports core WordPress blocks. Custom block support may be added in future versions.

= Does this work with custom post types? =
Yes. Block Binder works with any post type that uses the block editor and has post meta.

== Screenshots ==

1. Block Binder sidebar panel in the block editor
2. Selecting a block attribute to bind
3. Choosing from available post meta keys
4. Successfully bound binding indicator

== Changelog ==

= 1.0.0 =
* Initial release
* REST API for dynamic meta key loading
* Support for 16+ core blocks
* Visual binding interface
* Secure capability and nonce checks

== Technical Details ==

**Custom Binding Source:** `lax-block-binder/post-meta`
- Registered via `register_block_bindings_source()`
- Retrieves post meta values via `get_post_meta()`

**REST Endpoint:** `GET /wp-json/lax-block-binder/v1/meta-keys`
- Requires `edit_posts` capability
- Returns array of available meta keys
- Secured with WordPress nonce verification

**JavaScript Framework:** @wordpress/scripts
- Uses React hooks for state management
- Built with @wordpress/components for UI
- Integrates with @wordpress/block-editor for block manipulation

== Support ==

For bug reports, feature requests, or questions, please visit:
https://github.com/laxmariappan/lax-block-binder

== License ==

Lax Block Binder is licensed under the GPL v2 or later.

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

== Credits ==

**Author:** Lax Mariappan
**Contributors:** Oz (AI Assistant)

Built with ❤️ for the WordPress community.
