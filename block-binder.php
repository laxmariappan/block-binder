<?php
/**
 * Plugin Name: Block Binder
 * Plugin URI: https://laxmariappan.com/block-binder
 * Description: Visually bind post meta to core blocks using the Block Bindings API
 * Version: 1.0.0
 * Author: Lax Mariappan
 * Author URI: https://laxmariappan.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: block-binder
 * Domain Path: /languages
 * Requires at least: 6.5
 * Requires PHP: 7.4
 *
 * @package BlockBinder
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue the block editor sidebar script.
 */
function block_binder_enqueue_assets() {
	// Only load in the block editor context.
	if ( ! is_admin() ) {
		return;
	}

	$current_screen = get_current_screen();
	if ( ! $current_screen || ! $current_screen->is_block_editor() ) {
		return;
	}

	// Enqueue the compiled sidebar script.
	wp_enqueue_script(
		'block-binder-sidebar',
		plugins_url( 'build/index.js', __FILE__ ),
		array( 'wp-plugins', 'wp-edit-post', 'wp-blocks', 'wp-data', 'wp-element' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ),
		true
	);

	// Localize script with available post meta keys.
	$meta_keys = block_binder_get_registered_meta_keys();
	wp_localize_script(
		'block-binder-sidebar',
		'blockBinderData',
		array(
			'supportedBlocks' => array(
				'core/paragraph',
				'core/heading',
				'core/image',
				'core/button',
				'core/list',
				'core/quote',
				'core/audio',
				'core/video',
				'core/columns',
				'core/column',
				'core/cover',
				'core/file',
				'core/gallery',
				'core/table',
				'core/preformatted',
				'core/verse',
			),
			'postId'          => get_the_ID(),
			'metaKeys'        => $meta_keys,
		)
	);
}
add_action( 'enqueue_block_assets', 'block_binder_enqueue_assets' );

/**
 * Register the custom binding source for post meta.
 */
function block_binder_register_binding_source() {
	// Only register on WordPress 6.5+.
	if ( ! function_exists( 'register_block_bindings_source' ) ) {
		return;
	}

	register_block_bindings_source(
		'block-binder/post-meta',
		array(
			'label'              => __( 'Post Meta (Block Binder)', 'block-binder' ),
			'get_value_callback' => 'block_binder_get_meta_value',
		)
	);
}
add_action( 'init', 'block_binder_register_binding_source' );

/**
 * Get all registered post meta keys.
 *
 * @return array Array of meta keys available for binding.
 */
function block_binder_get_registered_meta_keys() {
	global $wp_meta_keys;

	$meta_keys = array();

	// Get meta keys registered via register_meta().
	if ( isset( $wp_meta_keys['post'] ) ) {
		foreach ( $wp_meta_keys['post'] as $meta_key => $meta_data ) {
			// Only include keys that are not private (don't start with _).
			if ( strpos( $meta_key, '_' ) !== 0 ) {
				$meta_keys[] = $meta_key;
			}
		}
	}

	// Always include common custom meta keys.
	$default_keys = array( 'book_author', '_description', '_featured_image_alt', '_custom_field' );
	$meta_keys = array_unique( array_merge( $meta_keys, $default_keys ) );

	sort( $meta_keys );

	return $meta_keys;
}

/**
 * Callback to retrieve post meta values for block bindings.
 *
 * @param array $source_attrs The source attributes (should include 'key' for the meta key).
 * @param object $block_instance The block instance.
 * @param string $attribute_name The attribute name being bound.
 * @return mixed The meta value or null if not found.
 */
function block_binder_get_meta_value( $source_attrs, $block_instance, $attribute_name ) {
	if ( empty( $source_attrs['key'] ) ) {
		return null;
	}

	$post_id = $block_instance->context['postId'] ?? get_the_ID();
	$meta_value = get_post_meta( $post_id, sanitize_key( $source_attrs['key'] ), true );

	return $meta_value ?: null;
}
