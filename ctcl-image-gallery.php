<?php
/*
 Plugin Name:CTCL Image Gallery
 Donate link: https://www.patreon.com/ujw0l/membership
 Plugin URI :https://github.com/ujw0l/ctcl-image-gallery
 Description: CTC Lite gutenberg block addon to add image gallery 
 Version: 2.0.0
 Author: UjW0L
 Author URI:https://ujw0l.github.io/
 Text Domain:  ctcl-image-gallery
 License: GPLv2
*/


    class ctclImageGal{


        public function __construct(){
            define('CTCLIG_DIR_PATH',plugin_dir_url(__FILE__) );
            self::requiredWpAction();
        }


/**
   * @since 1.0.0
   *
   * Register required wp action
   */
  public function requiredWpAction(){
    add_action( 'wp_enqueue_scripts', array($this,'enequeFrontendJs' ));
    add_action( 'wp_enqueue_scripts', array($this,'enequeFrontendCss' ));
    add_action( 'init', array($this,'registerGutenbergBlocks' ));
  }


  /**
   * @since 1.0.0
   *
   * eneque frontend JS files
   */

  public function enequeFrontendJs(){
    wp_enqueue_script('ctclJsOverlay', CTCLIG_DIR_PATH.'js/ctc_overlay.js',array());
    wp_enqueue_script('ctcligFrontendJs', CTCLIG_DIR_PATH.'js/ctcl-image-gal-fe.js',array('ctclJsOverlay'));
  }

  /**
   * @since 1.0.0
   *
   * eneque frontend CSS files
   */

  public function enequeFrontendCss(){
    wp_enqueue_style( 'ctclFrontendCss', CTCLIG_DIR_PATH.'css/ctcl-image-gal-fe.css'); 
}


    


    /**
   * @since 1.0.0
   *
   * Register gutenberg block
   * 
   */
  public function registerGutenbergBlocks(){
  


	// Block Editor Script.
wp_register_script(
    'ctclig-block-editor',
    plugins_url( 'js/ctcl-img-gal-block.js',__FILE__ ),
    array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-edit-post','wp-components', 'wp-i18n','wp-data' ),
 );
 
  // Block front end styles.
  wp_register_style(
     'ctclig-block-frontend-styles',
     plugins_url( 'css/ctcl-image-gal-fe.css',__FILE__ ),
 
  );
 
  // Block editor styles.
  wp_register_style(
     'ctclig-editor-styles',
     plugins_url( 'css/ctcl-image-gal-block.css',__FILE__ ),
     array( 'wp-edit-blocks','dashicons' ),
  );
 
 register_block_type(
     'ctcl-image-gallery/ctcl-image-gallery',
    array(
       'style'         => 'ctclig-block-frontend-styles',
       'editor_style'  => 'ctclig-editor-styles',
       'editor_script' => 'ctclig-block-editor',
    )
 );

  }
    }
    new ctclImageGal();


    