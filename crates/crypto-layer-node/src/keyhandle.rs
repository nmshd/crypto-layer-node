use neon::prelude::*;

use crate::common::{arc_or_poisoned_error_deferred, spawn_promise};
use crate::fromjs::error::unwrap_or_throw;
use crate::fromjs::vec_from_uint_8_array;
use crate::tojs::config::wrap_key_spec;
use crate::tojs::uint_8_array_from_vec_u8;
use crate::{box_if_ok, JsKeyHandle};

/// Wraps `id` function.
///
/// # Arguments
///
/// # Returns
/// * `string` - id of key
///
/// # Throws
/// * When failing to execute.
pub fn export_id(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let id = handle.id();

        deferred.settle_with(&channel, |mut cx| Ok(cx.string(unwrap_or_throw!(cx, id))));
    })
}

/// Wraps `delete` function.
///
/// # Arguments
///
/// # Returns
/// * `undefined`
///
/// # Throws
/// * When failing to execute.
pub fn export_delete(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let result = handle.clone().delete();

        deferred.settle_with(&channel, |mut cx| {
            unwrap_or_throw!(cx, result);
            Ok(cx.undefined())
        });
    })
}

/// Wraps `encrypt_data` function.
///
/// # Arguments
/// * **data**: `Uint8Array`
/// * **iv**: `Uint8Array`
///
/// # Returns
/// * `[Uint8Array, Uint8Array]` - on success
///
/// # Throws
/// * When failing to execute.
pub fn export_encrypt_data(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();
    let data_js = cx.argument::<JsUint8Array>(0)?;
    let data = vec_from_uint_8_array(&mut cx, data_js);
    let iv_js = cx.argument::<JsUint8Array>(1)?;
    let iv = vec_from_uint_8_array(&mut cx, iv_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let result = handle.encrypt_data(&data, &iv);

        deferred.settle_with(&channel, |mut cx| {
            let (encrypted_data, iv) = unwrap_or_throw!(cx, result);

            let arr = cx.empty_array();
            let encrypted_data_js = JsUint8Array::from_slice(&mut cx, &encrypted_data)?;
            arr.set(&mut cx, 0, encrypted_data_js)?;
            let iv_js = uint_8_array_from_vec_u8(&mut cx, iv)?;
            arr.set(&mut cx, 1, iv_js)?;
            Ok(arr)
        });
    })
}

/// Wraps `encrypt` function.
///
/// # Arguments
/// * **data**: `Uint8Array`
///
/// # Returns
/// * `[Uint8Array, Uint8Array]` - on success
///
/// # Throws
/// * When failing to execute.
pub fn export_encrypt(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();
    let data_js = cx.argument::<JsUint8Array>(0)?;
    let data = vec_from_uint_8_array(&mut cx, data_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let result = handle.encrypt(&data);

        deferred.settle_with(&channel, |mut cx| {
            let (encrypted_data, iv) = unwrap_or_throw!(cx, result);

            let arr = cx.empty_array();
            let encrypted_data_js = JsUint8Array::from_slice(&mut cx, &encrypted_data)?;
            arr.set(&mut cx, 0, encrypted_data_js)?;
            let iv_js = uint_8_array_from_vec_u8(&mut cx, iv)?;
            arr.set(&mut cx, 1, iv_js)?;
            Ok(arr)
        });
    })
}

/// Wraps `encrypt` function.
///
/// # Arguments
/// * **data**: `Uint8Array`
/// * **iv**: `Uint8Array`
///
/// # Returns
/// * `Uint8Array` - on success
///
/// # Throws
/// * When failing to execute.
pub fn export_encrypt_with_iv(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();
    let data_js = cx.argument::<JsUint8Array>(0)?;
    let data = vec_from_uint_8_array(&mut cx, data_js);
    let iv_js = cx.argument::<JsUint8Array>(1)?;
    let iv = vec_from_uint_8_array(&mut cx, iv_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let result = handle.encrypt_with_iv(&data, &iv);

        deferred.settle_with(&channel, |mut cx| {
            let encrypted_data = unwrap_or_throw!(cx, result);

            uint_8_array_from_vec_u8(&mut cx, encrypted_data)
        });
    })
}

/// Wraps `decrypt_data` function.
///
/// # Arguments
/// * **encryptedData**: `Uint8Array`
/// * **iv**: `Uint8Array`
///
/// # Returns
/// * `Uint8Array` - decrypted data on success
///
/// # Throws
/// * When failing to execute.
pub fn export_decrypt_data(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();
    let data_js = cx.argument::<JsUint8Array>(0)?;
    let data = vec_from_uint_8_array(&mut cx, data_js);
    let iv_js = cx.argument::<JsUint8Array>(1)?;
    let iv = vec_from_uint_8_array(&mut cx, iv_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let decrypted_data = handle.decrypt_data(&data, &iv);

        deferred.settle_with(&channel, |mut cx| {
            let decrypted_data = unwrap_or_throw!(cx, decrypted_data);
            Ok(uint_8_array_from_vec_u8(&mut cx, decrypted_data)?)
        });
    })
}

/// Wraps `extract_key` function.
///
/// # Arguments
///
/// # Returns
/// * `Uint8Array` - key on success
///
/// # Throws
/// * When failing to execute.
pub fn export_extract_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let key = handle.extract_key();

        deferred.settle_with(&channel, |mut cx| {
            let key = unwrap_or_throw!(cx, key);
            Ok(uint_8_array_from_vec_u8(&mut cx, key)?)
        });
    })
}

/// Wraps `spec` function.
///
/// # Arguments
///
/// # Returns
/// * `KeySpec` - spec of key
///
/// # Throws
pub fn export_spec(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let spec = handle.spec();

        deferred.settle_with(&channel, move |mut cx| wrap_key_spec(&mut cx, spec));
    })
}

pub fn export_derive_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let handle_arc = (**cx.this::<JsKeyHandle>()?).clone();
    let nonce_js = cx.argument::<JsUint8Array>(0)?;
    let nonce = vec_from_uint_8_array(&mut cx, nonce_js);

    spawn_promise(&mut cx, move |channel, deferred| {
        let handle = arc_or_poisoned_error_deferred!(&channel, deferred, handle_arc.read());

        let derived_key = handle.derive_key(&nonce);

        deferred.settle_with(&channel, move |mut cx| box_if_ok(&mut cx, derived_key));
    })
}
