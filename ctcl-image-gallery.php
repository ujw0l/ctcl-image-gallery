<?php
/**
 * Plugin Name:       CTCL Image Gallery
 * Description:       Responsive image gallery with an interactive thumbnail strip and refined captions.
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Version:           2.3.0
 * Author:            UjW0L
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ctcl-image-gallery
 * Domain Path:       /languages
 *
 * @package CTCLImageGallery
 */

if ( ! defined( 'ABSPATH' ) ) {
 exit;
}

/** Collect the registered frontend script graph in dependency order. */
function ctcl_image_gallery_preview_scripts( $handle, &$seen ) {
 if ( isset( $seen[ $handle ] ) ) {
  return array();
 }
 $seen[ $handle ] = true;
 $scripts = wp_scripts();
 if ( ! isset( $scripts->registered[ $handle ] ) ) {
  return array();
 }
 $script = $scripts->registered[ $handle ];
 $urls = array();
 foreach ( $script->deps as $dependency ) {
  $urls = array_merge( $urls, ctcl_image_gallery_preview_scripts( $dependency, $seen ) );
 }
 if ( ! $script->src ) {
  return $urls;
 }
 $src = $script->src;
 if ( ! preg_match( '#^(?:https?:)?//#i', $src ) ) {
  $src = $scripts->base_url . $src;
 }
 $version = null === $script->ver ? '' : ( $script->ver ? $script->ver : $scripts->default_version );
 if ( $version ) {
  $src = add_query_arg( 'ver', $version, $src );
 }
 $urls[] = esc_url_raw( apply_filters( 'script_loader_src', $src, $handle ) );
 return $urls;
}

/** Register from canonical block metadata; assets load with their blocks. */
function ctcl_image_gallery_block_init() {
 $preview_assets = array();
 foreach ( array( 'lightbox-gallery' ) as $directory ) {
  $block = register_block_type( __DIR__ . '/build' );
  if ( ! $block ) {
   continue;
  }
  $seen = array();
  $preview_scripts = array();
  foreach ( $block->view_script_handles as $handle ) {
   $preview_scripts = array_merge( $preview_scripts, ctcl_image_gallery_preview_scripts( $handle, $seen ) );
  }
  $preview_assets[ $directory ] = array(
   'style' => add_query_arg( 'ver', '2.3.0', plugins_url( 'build/style-index.css', __FILE__ ) ),
   'scripts' => $preview_scripts,
  );
  foreach ( array_merge( $block->editor_script_handles, $block->view_script_handles ) as $handle ) {
   wp_set_script_translations( $handle, 'ctcl-image-gallery', __DIR__ . '/languages' );
  }
 }
 foreach ( array( 'lightbox-gallery' ) as $directory ) {
  $handle = generate_block_asset_handle( 'ctcl-image-gallery/ctcl-image-gallery', 'editorScript' );
  wp_add_inline_script( $handle, 'window.ctclGalleryPreviewAssets = ' . wp_json_encode( $preview_assets ) . ';', 'before' );
 }
}
add_action( 'init', 'ctcl_image_gallery_block_init' );
