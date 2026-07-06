import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import {
	useSelect,
	useDispatch,
} from '@wordpress/data';
import {
	Button,
	SelectControl,
	__experimentalVStack as VStack,
	__experimentalText as Text,
} from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * BlockBinderPanel Component
 * Allows users to visually bind post meta to supported core blocks.
 */
function BlockBinderPanel() {
	// Get the currently selected block.
	const { selectedBlock, selectedBlockName } = useSelect( ( select ) => {
		const blockEditor = select( blockEditorStore );
		const selectedBlockClientId = blockEditor.getSelectedBlockClientId();

		if ( ! selectedBlockClientId ) {
			return {
				selectedBlock: null,
				selectedBlockName: null,
			};
		}

		const block = blockEditor.getBlock( selectedBlockClientId );

		return {
			selectedBlock: block,
			selectedBlockName: block?.name || null,
		};
	}, [] );

	// Dispatch actions.
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	// List of supported blocks.
	const supportedBlocks = window.laxbbData?.supportedBlocks || [
		'core/paragraph',
		'core/heading',
		'core/image',
		'core/button',
	];

	// Check if the selected block is supported.
	const isSupported = selectedBlockName && supportedBlocks.includes( selectedBlockName );

	// Define attribute options based on block type.
	const getAttributeOptions = () => {
		const blockAttributeMap = {
			'core/paragraph': [ 'content' ],
			'core/heading': [ 'content' ],
			'core/heading/h1': [ 'content' ],
			'core/heading/h2': [ 'content' ],
			'core/heading/h3': [ 'content' ],
			'core/heading/h4': [ 'content' ],
			'core/heading/h5': [ 'content' ],
			'core/heading/h6': [ 'content' ],
			'core/image': [ 'url', 'alt', 'title', 'caption' ],
			'core/button': [ 'text', 'url', 'title' ],
			'core/list': [ 'values' ],
			'core/quote': [ 'value', 'citation' ],
			'core/audio': [ 'src', 'caption' ],
			'core/video': [ 'src', 'caption' ],
			'core/columns': [ 'className' ],
			'core/column': [ 'className' ],
			'core/cover': [ 'backgroundImageUrl', 'title', 'subtitle' ],
			'core/file': [ 'href', 'fileName', 'textLinkTarget' ],
			'core/gallery': [ 'caption' ],
			'core/table': [ 'caption' ],
			'core/preformatted': [ 'content' ],
			'core/verse': [ 'content' ],
		};

		return blockAttributeMap[ selectedBlockName ] || [];
	};

	const attributeOptions = getAttributeOptions();

	// State for selected attribute and meta key.
	const [ selectedAttribute, setSelectedAttribute ] = useState( '' );
	const [ selectedMetaKey, setSelectedMetaKey ] = useState( '' );
	const [ metaKeys, setMetaKeys ] = useState( [] );
	const [ isLoadingMetaKeys, setIsLoadingMetaKeys ] = useState( false );

	// Fetch meta keys from REST API on component mount.
	useEffect( () => {
		const fetchMetaKeys = async () => {
			if ( ! window.laxbbData?.restUrl ) {
				return;
			}

			setIsLoadingMetaKeys( true );
			try {
				const response = await apiFetch( {
					path: window.laxbbData.restUrl,
					headers: {
						'X-WP-Nonce': window.laxbbData.nonce,
					},
				} );
				setMetaKeys( response.meta_keys || [] );
			} catch ( error ) {
				console.error( 'Failed to fetch meta keys:', error );
			} finally {
				setIsLoadingMetaKeys( false );
			}
		};

		fetchMetaKeys();
	}, [] );

	// Current binding (if any).
	const currentBindings = selectedBlock?.attributes?.metadata?.bindings || {};
	const existingBoundAttribute = Object.keys( currentBindings )[ 0 ] || '';

	// Handle binding.
	const handleBind = ( metaKey, attributeName ) => {
		if ( ! metaKey || ! attributeName ) {
			return;
		}

		const metadata = selectedBlock?.attributes?.metadata || {};
		const bindings = metadata.bindings || {};

		bindings[ attributeName ] = {
		source: 'lax-block-binder/post-meta',
			args: {
				key: metaKey,
			},
		};

		updateBlockAttributes( selectedBlock.clientId, {
			metadata: {
				...metadata,
				bindings,
			},
		} );
	};

	// Handle unbinding.
	const handleUnbind = ( attributeName ) => {
		const metadata = selectedBlock?.attributes?.metadata || {};
		const bindings = { ...metadata.bindings };

		delete bindings[ attributeName ];

		updateBlockAttributes( selectedBlock.clientId, {
			metadata: {
				...metadata,
				bindings: Object.keys( bindings ).length > 0 ? bindings : undefined,
			},
		} );
	};

	// If no block is selected or block is not supported, show message.
	if ( ! isSupported ) {
		return (
			<PluginDocumentSettingPanel title={ __( 'Block Binder', 'lax-block-binder' ) } icon="admin-links">
				<Text>
					{ __( 'Select a supported block (Paragraph, Heading, Image, or Button) to bind post meta.', 'lax-block-binder' ) }
				</Text>
			</PluginDocumentSettingPanel>
		);
	}

	return (
		<PluginDocumentSettingPanel title={ __( 'Block Binder', 'lax-block-binder' ) } icon="admin-links">
			<VStack spacing={ 3 }>
				<Text variant="subtitle">
					{ selectedBlockName }
				</Text>

				<SelectControl
					label={ __( 'Block Attribute to Bind', 'lax-block-binder' ) }
					value={ selectedAttribute }
					options={ [
						{ label: __( 'Select an attribute...', 'lax-block-binder' ), value: '' },
						...attributeOptions.map( ( attr ) => ( {
							label: attr,
							value: attr,
						} ) ),
					] }
					onChange={ setSelectedAttribute }
				/>

				<SelectControl
					label={ __( 'Post Meta Key', 'lax-block-binder' ) }
					value={ selectedMetaKey }
					options={ [
						{ label: isLoadingMetaKeys ? __( 'Loading...', 'lax-block-binder' ) : __( 'Select a meta key...', 'lax-block-binder' ), value: '' },
						...metaKeys.map( ( key ) => ( {
							label: key,
							value: key,
						} ) ),
					] }
					onChange={ setSelectedMetaKey }
					disabled={ isLoadingMetaKeys }
				/>

				<Button
					isDisabled={ ! selectedAttribute || ! selectedMetaKey }
					onClick={ () => {
						if ( selectedAttribute && selectedMetaKey ) {
							handleBind( selectedMetaKey, selectedAttribute );
							setSelectedAttribute( '' );
							setSelectedMetaKey( '' );
						}
					} }
				>
					{ __( 'Bind', 'lax-block-binder' ) }
				</Button>

				{ existingBoundAttribute && Object.keys( currentBindings ).length > 0 && (
					<>
						<Button
							isDestructive
							onClick={ () => handleUnbind( existingBoundAttribute ) }
						>
							{ __( 'Unbind', 'lax-block-binder' ) }
						</Button>
						<Text variant="caption">
							{ __( 'Current binding:', 'lax-block-binder' ) } { existingBoundAttribute } → { currentBindings[ existingBoundAttribute ].args?.key }
						</Text>
					</>
				) }
			</VStack>
		</PluginDocumentSettingPanel>
	);
}

// Register the plugin and panel.
registerPlugin( 'laxbb-panel', {
	render: BlockBinderPanel,
} );
