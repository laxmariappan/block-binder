# Block Binder

[![WordPress 6.5+](https://img.shields.io/badge/WordPress-6.5%2B-blue.svg)](https://wordpress.org/)
[![PHP 7.4+](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://www.php.net/)
[![License: GPL v2](https://img.shields.io/badge/License-GPLv2-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
[![GitHub](https://img.shields.io/badge/GitHub-laxmariappan%2Fblock--binder-black.svg)](https://github.com/laxmariappan/block-binder)

Visually bind post meta to core WordPress blocks using the **Block Bindings API**. No code required.

## Overview

Block Binder provides a user-friendly sidebar panel in the WordPress block editor that lets you:

1. **Select a block** — Choose from 16+ supported core blocks
2. **Pick an attribute** — Text, URL, image, caption, etc.
3. **Bind to post meta** — Connect to any post meta key on your site
4. **Done** — The block automatically displays the meta value on the frontend

No hardcoding, no custom code, no complexity. Just point and bind.

## Features

✨ **Visual Block Binding Interface**
- Sidebar panel appears when a supported block is selected
- Intuitive dropdowns for attributes and meta keys
- Real-time binding status indicator

📦 **16+ Supported Blocks**
- `core/paragraph`, `core/heading` (h1–h6)
- `core/image`, `core/button`, `core/list`, `core/quote`
- `core/audio`, `core/video`, `core/columns`, `core/column`
- `core/cover`, `core/file`, `core/gallery`, `core/table`
- `core/preformatted`, `core/verse`

🔄 **Dynamic Meta Key Discovery**
- Automatically discovers meta keys from your site's database
- Shows meta keys from published and draft posts
- Merges with registered meta keys via `register_meta()`

⚡ **REST API Integration**
- Asynchronous meta key loading
- Zero page load overhead
- Fresh data every time you open the editor

🔒 **Secure & Compliant**
- Respects WordPress security standards
- Nonce verification on all REST endpoints
- Capability checks (`edit_posts`)
- Sanitized inputs and escaped output

## Requirements

- **WordPress 6.5** or higher (requires Block Bindings API)
- **PHP 7.4** or higher
- Block editor support (Gutenberg)

## Installation

### From GitHub (Development)

```bash
# Clone the repository
git clone https://github.com/laxmariappan/block-binder.git

# Install into WordPress
mv block-binder ~/path/to/wp-content/plugins/

# Navigate to the plugin directory
cd wp-content/plugins/block-binder

# Install dependencies
npm install

# Build the plugin
npm run build

# Activate in WordPress admin or via WP-CLI
wp plugin activate block-binder
```

### From WordPress.org (Coming Soon)

Once published to the WordPress plugin repository, you can:

1. Go to **Plugins > Add New** in WordPress admin
2. Search for "Block Binder"
3. Click **Install Now** and then **Activate**

## Usage

### Basic Workflow

1. **Edit a Post/Page**
   - Open any post or page in the block editor

2. **Select a Supported Block**
   - Click on a Paragraph, Heading, Image, Button, or other supported block

3. **Open Block Binder Panel**
   - Look for "Block Binder" in the document settings sidebar (right panel)
   - If not visible, click the "Settings" icon in the toolbar

4. **Choose an Attribute**
   - Select which attribute to bind (e.g., "content" for Paragraph, "url" for Image)

5. **Select a Meta Key**
   - Choose a post meta key from the dropdown
   - The dropdown auto-populates with meta keys from your site

6. **Bind the Connection**
   - Click the **Bind** button
   - The binding is saved to the block's metadata

7. **Unbind (Optional)**
   - Click **Unbind** to remove an existing binding

### Example: Bind Author Name to a Paragraph

Suppose you have:
- A **Paragraph block** in your post
- A post meta key called `book_author` containing "Jane Smith"

Steps:
1. Select the Paragraph block
2. Open Block Binder panel
3. Attribute: Choose "content"
4. Meta Key: Choose "book_author"
5. Click **Bind**

**Result:** The paragraph will now display "Jane Smith" on the frontend, pulling from the post meta.

### Supported Block Attributes

#### Text Blocks
- **Paragraph, Heading** → `content`
- **Preformatted, Verse** → `content`

#### Media Blocks
- **Image** → `url`, `alt`, `title`, `caption`
- **Audio, Video** → `src`, `caption`
- **File** → `href`, `fileName`, `textLinkTarget`

#### Other Blocks
- **Button** → `text`, `url`, `title`
- **List** → `values`
- **Quote** → `value`, `citation`
- **Columns, Column** → `className`
- **Cover** → `backgroundImageUrl`, `title`, `subtitle`
- **Gallery, Table** → `caption`

## Development

### Project Structure

```
block-binder/
├── block-binder.php           # Main plugin file (179 lines)
├── README.md                  # GitHub documentation (this file)
├── readme.txt                 # WordPress.org format
├── package.json               # npm configuration
├── src/
│   └── index.js               # React component for sidebar panel
├── build/                     # Compiled output (gitignored)
│   ├── index.js               # Minified bundle (3.78 KiB)
│   └── index.asset.php        # Dependency manifest
└── .gitignore                 # Excludes build/ and node_modules/
```

### Local Development Setup

```bash
# Clone and install
git clone https://github.com/laxmariappan/block-binder.git
cd block-binder
npm install

# Watch mode — rebuild on file changes
npm start

# Build for production
npm run build

# Lint JavaScript
npm run lint

# Format code
npm run format
```

### Build Process

The plugin uses **@wordpress/scripts** for building:

```bash
npm run build    # One-time production build
npm start        # Watch mode (hot reload)
```

**Output:**
- `build/index.js` — Compiled React component (minified)
- `build/index.asset.php` — Dependency manifest (auto-generated)

### Code Structure

**PHP (`block-binder.php`):**
- `block_binder_enqueue_assets()` — Loads the sidebar script
- `block_binder_register_binding_source()` — Registers the custom binding source
- `block_binder_register_rest_endpoint()` — Registers REST API endpoint
- `block_binder_rest_get_meta_keys()` — Fetches available meta keys
- `block_binder_get_meta_value()` — Retrieves post meta values for frontend rendering

**JavaScript (`src/index.js`):**
- `BlockBinderPanel()` — React component for the sidebar UI
- `useEffect()` hook — Fetches meta keys via REST API on component mount
- `useState()` hooks — Manages selected attribute, meta key, and loading state
- `handleBind()` — Writes binding metadata to block attributes
- `handleUnbind()` — Removes binding metadata

### REST API

**Endpoint:** `GET /wp-json/block-binder/v1/meta-keys`

**Response:**
```json
{
  "meta_keys": ["book_author", "_description", "custom_field", ...]
}
```

**Permission:** Requires `edit_posts` capability  
**Security:** Nonce verification via `X-WP-Nonce` header

## Architecture

### Block Bindings API Integration

Block Binder registers a custom binding source with WordPress:

```php
register_block_bindings_source(
    'block-binder/post-meta',
    [
        'label' => 'Post Meta (Block Binder)',
        'get_value_callback' => 'block_binder_get_meta_value',
    ]
);
```

When a block is bound, WordPress stores the binding in the block's `metadata.bindings` object:

```json
{
  "metadata": {
    "bindings": {
      "content": {
        "source": "block-binder/post-meta",
        "args": {
          "key": "book_author"
        }
      }
    }
  }
}
```

On the frontend, WordPress's Block Bindings API automatically pulls the post meta value and renders it in place of the hardcoded attribute.

### Performance Optimization

**Dynamic Meta Key Loading (REST API):**
- Previously: Database query on every page load → slow
- Now: Async REST call after editor loads → instant UI + background data fetch
- Meta keys update fresh every time you open the editor panel

## Security

✅ **Capability Checks** — Only users who can `edit_posts` can access the binding interface  
✅ **Nonce Verification** — REST endpoints use WordPress nonce validation  
✅ **Input Sanitization** — All meta keys are sanitized with `sanitize_key()`  
✅ **Output Escaping** — Block attributes are properly escaped by WordPress  
✅ **SQL Prepared Statements** — Database queries use `$wpdb->prepare()`  

## Troubleshooting

### Block Binder Panel Doesn't Appear

- **Check WordPress version:** Block Binder requires WordPress 6.5+
- **Check PHP version:** PHP 7.4+ is required
- **Make sure plugin is activated:** Go to **Plugins** and verify "Block Binder" is active
- **Refresh the editor:** Close and reopen the block editor

### Meta Keys Aren't Showing in Dropdown

- **Wait for loading:** The dropdown shows "Loading..." while fetching. Wait a moment.
- **Check REST API:** Verify `/wp-json/block-binder/v1/meta-keys` is accessible
- **Verify posts exist:** Block Binder discovers meta keys from published/draft posts. Make sure you have posts with the meta keys you're looking for.

### Binding Doesn't Work on Frontend

- **Check WordPress version:** Block Bindings API requires WordPress 6.5+
- **Verify binding saved:** Look for "Current binding:" text in the Block Binder panel
- **Check post meta value:** Ensure the post meta key actually has a value

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### 1.0.0 (Current)
- Initial release
- REST API for dynamic meta key loading
- Support for 16+ core blocks
- Visual binding interface in sidebar
- Secure capability and nonce checks
- WordPress.org compliant documentation

## License

Block Binder is licensed under the **GPL v2 or later**.

```
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.
```

See [LICENSE.txt](https://www.gnu.org/licenses/gpl-2.0.html) for full details.

## Credits

**Author:** [Lax Mariappan](https://github.com/laxmariappan)  
**Contributors:** [Oz AI Assistant](https://github.com/orgs/warpdotdev/teams/oz)

Built with ❤️ for the WordPress community.

## Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/laxmariappan/block-binder/issues)
- **Discussions:** [Ask questions and share ideas](https://github.com/laxmariappan/block-binder/discussions)
- **WordPress.org:** [Plugin page](https://wordpress.org/plugins/block-binder/) (coming soon)

---

Made with WordPress ❤️
