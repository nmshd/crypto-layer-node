use neon::prelude::*;

use crate::common::{arc_or_poisoned_error_deferred, box_if_ok, spawn_promise};
use crate::fromjs::error::unwrap_or_throw;
use crate::fromjs::vec_from_uint_8_array;
use crate::tojs::config::wrap_provider_config;
use crate::tojs::uint_8_array_from_vec_u8;
use crate::JsProvider;
use crate::{from_wrapped_key_pair_spec, from_wrapped_key_spec};

/// Wraps `create_key` function.
///
/// # Arguments
/// * **spec**: `KeySpec`
///
/// # Returns
/// * `{}` - bare key handle on success
///
/// # Throws
/// * When one of the inputs is incorrect.
/// * When failing to generate the key.
pub fn export_create_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let spec_js = cx.argument::<JsObject>(0)?;

    let spec = unwrap_or_throw!(cx, from_wrapped_key_spec(&mut cx, spec_js));

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_handle_result = provider.create_key(spec);

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_handle_result));
    })
}

/// Wraps `create_key_pair` function.
///
/// # Arguments
/// * **spec**: `KeyPairSpec`
///
/// # Returns
/// * `{}` - bare key pair handle on success
///
/// # Throws
/// * When one of the inputs is incorrect.
/// * When failing to generate the key pair.
pub fn export_create_key_pair(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let spec_js = cx.argument::<JsObject>(0)?;

    let spec = unwrap_or_throw!(cx, from_wrapped_key_pair_spec(&mut cx, spec_js));

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_pair_handle_result = provider.create_key_pair(spec);

        deferred.settle_with(&channel, |mut cx| {
            box_if_ok(&mut cx, key_pair_handle_result)
        });
    })
}

/// Wraps `provider_name` function.
///
/// # Arguments
///
/// # Returns
/// * `string` - provider name
///
/// # Throws
pub fn export_provider_name(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_js = cx.this::<JsProvider>()?;
    let provider = unwrap_or_throw!(cx, provider_js.read());
    let (deferred, promise) = cx.promise();
    let name = cx.string(provider.provider_name());
    deferred.resolve(&mut cx, name);
    Ok(promise)
}

/// Wraps `load_key` function.
///
/// # Arguments
/// * **id**: `string`
///
/// # Returns
/// * `{}` - bare key handle on success
///
/// # Throws
/// * When failing to load the key.
pub fn export_load_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let id_js = cx.argument::<JsString>(0)?;
    let id = id_js.value(&mut cx);

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_handle_result = provider.load_key(id.clone());

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_handle_result));
    })
}

/// Wraps `load_key_pair` function.
///
/// # Arguments
/// * **id**: `string`
///
/// # Returns
/// * `{}` - bare key pair handle on success
///
/// # Throws
/// * When failing to load the key pair.
pub fn export_load_key_pair(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let id_js = cx.argument::<JsString>(0)?;
    let id = id_js.value(&mut cx);

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_pair_handle = provider.load_key_pair(id.clone());

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_pair_handle));
    })
}

/// Wraps `import_key` function.
///
/// # Arguments
/// * **spec**: `KeySpec`
/// * **key**: `Uint8Array`
///
/// # Returns
/// * `{}` - bare key handle on success
///
/// # Throws
/// * When one of the inputs is incorrect.
/// * When failing to import the key.
pub fn export_import_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let spec_js = cx.argument::<JsObject>(0)?;
    let spec = unwrap_or_throw!(cx, from_wrapped_key_spec(&mut cx, spec_js));
    let raw_key_js = cx.argument::<JsUint8Array>(1)?;
    let raw_key = vec_from_uint_8_array(&mut cx, raw_key_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_handle = provider.import_key(spec, &raw_key);

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_handle));
    })
}

/// Wraps `import_key_pair` function.
///
/// # Arguments
/// * **spec**: `KeyPairSpec`
/// * **publicKey**: `Uint8Array`
/// * **privateKey**: `Uint8Array`
///
/// # Returns
/// * `{}` - bare key pair handle on success
///
/// # Throws
/// * When one of the inputs is incorrect.
/// * When failing to import the key pair.
pub fn export_import_key_pair(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let spec_js = cx.argument::<JsObject>(0)?;
    let spec = unwrap_or_throw!(cx, from_wrapped_key_pair_spec(&mut cx, spec_js));
    let raw_public_key_js = cx.argument::<JsUint8Array>(1)?;
    let raw_public_key = vec_from_uint_8_array(&mut cx, raw_public_key_js);
    let raw_private_key_js = cx.argument::<JsUint8Array>(2)?;
    let raw_private_key = vec_from_uint_8_array(&mut cx, raw_private_key_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_pair_handle = provider.import_key_pair(spec, &raw_public_key, &raw_private_key);

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_pair_handle));
    })
}

/// Wraps `import_public_key` function.
///
/// # Arguments
/// * **spec**: `KeyPairSpec`
/// * **publicKey**: `Uint8Array`
///
/// # Returns
/// * `{}` - bare key pair handle on success
///
/// # Throws
/// * When one of the inputs is incorrect.
/// * When failing to import the public key.
pub fn export_import_public_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let spec_js = cx.argument::<JsObject>(0)?;
    let spec = unwrap_or_throw!(cx, from_wrapped_key_pair_spec(&mut cx, spec_js));
    let raw_public_key_js = cx.argument::<JsUint8Array>(1)?;
    let raw_public_key = vec_from_uint_8_array(&mut cx, raw_public_key_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let key_pair_handle = provider.import_public_key(spec, &raw_public_key);

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_pair_handle));
    })
}

/// Wraps `get_capabilities` function.
///
/// # Arguments
///
/// # Returns
/// * `ProviderConfig` - config on success
/// * `undefined` - none on failure
///
/// # Throws
/// * When failing to wrap provider config.
pub fn export_get_capabilities(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();

    spawn_promise(&mut cx, move |channel, deferred| {
        let provider = arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.read());

        if let Some(capabilities) = provider.get_capabilities() {
            deferred.settle_with(&channel, |mut cx| {
                wrap_provider_config(&mut cx, capabilities)
            });
        } else {
            deferred.settle_with(&channel, |mut cx| Ok(cx.undefined()));
        }
    })
}

/// Wraps `ephemeral_dh_exchange` function.
///
/// # Arguments
/// * **spec**: `KeyPairSpec`
///
/// # Returns
/// * `{}` - bare dh exchange
///
/// # Throws
/// * When one of the inputs is incorrect.
/// * When failing to start the dh exchange.
pub fn export_start_ephemeral_dh_exchange(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let spec_js = cx.argument::<JsObject>(0)?;
    let spec = unwrap_or_throw!(cx, from_wrapped_key_pair_spec(&mut cx, spec_js));

    spawn_promise(&mut cx, move |channel, deferred| {
        let mut provider =
            arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.write());

        let dh_exchange = provider.start_ephemeral_dh_exchange(spec);

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, dh_exchange));
    })
}

/// Wraps `derive_key_from_password` function.
///
/// # Arguments
/// * **password**: `string`
/// * **salt**: `Uint8Array`
/// * **spec**: `object`
///
/// # Returns
/// * `object` - bare key pair handle
///
/// # Throws
/// * When one of the inputs is incorrect.
pub fn export_derive_key_from_password(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let password_js = cx.argument::<JsString>(0)?;
    let password = password_js.value(&mut cx);
    let salt_js = cx.argument::<JsUint8Array>(1)?;
    let salt = vec_from_uint_8_array(&mut cx, salt_js);
    let spec_js = cx.argument::<JsObject>(2)?;
    let spec = unwrap_or_throw!(cx, from_wrapped_key_pair_spec(&mut cx, spec_js));

    spawn_promise(&mut cx, move |channel, deferred| {
        let provider = arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.read());

        let key_pair_handle = provider.derive_key_from_password(&password, &salt, spec);

        deferred.settle_with(&channel, |mut cx| box_if_ok(&mut cx, key_pair_handle));
    })
}

/// Wraps `get_random` function.
///
/// # Arguments
/// * **len**: `number` will be converted into an usize.
///
/// # Returns
/// * `Uint8Array` - Byte array of `len` length.
///
/// # Throws
/// * When `len` is negative.
pub fn export_get_random(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let provider_arc = (**cx.this::<JsProvider>()?).clone();
    let len_js = cx.argument::<JsNumber>(0)?;
    let len = len_js.value(&mut cx);
    let len_trunc = len.trunc();

    if len_trunc < 0.0 {
        cx.error(format!(
            "ERROR: Bad argument. Expected positive number got {}",
            len_trunc
        ))?;
    }
    let len_usize = len.trunc() as usize;

    spawn_promise(&mut cx, move |channel, deferred| {
        let provider = arc_or_poisoned_error_deferred!(&channel, deferred, provider_arc.read());

        let random = provider.get_random(len_usize);

        deferred.settle_with(&channel, |mut cx| uint_8_array_from_vec_u8(&mut cx, random));
    })
}
