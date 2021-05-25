const { CheckboxControl, PanelBody, TextControl, Button, ColorPicker, SideBar, SelectControl } = wp.components;
const { InspectorControls, MediaUpload, } = wp.blockEditor;
const { PluginSidebar } = wp.editPost;
const { __ } = wp.i18n;
const cigEl = wp.element.createElement;
const { registerBlockType } = wp.blocks;