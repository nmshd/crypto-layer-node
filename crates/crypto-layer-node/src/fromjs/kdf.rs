use crate::error::js_result;

use super::{error::ConversionError, int_from_object};
use crypto_layer::prelude::*;
use neon::prelude::*;

pub fn argon_options_from_object<'a>(
    cx: &mut impl Context<'a>,
    object: Handle<JsObject>,
) -> Result<Argon2Options, ConversionError> {
    Ok(Argon2Options {
        memory: int_from_object(cx, object, "memory")?,
        iterations: int_from_object(cx, object, "iterations")?,
        parallelism: int_from_object(cx, object, "parallelism")?,
    })
}

pub fn kdf_from_object<'a>(
    cx: &mut impl Context<'a>,
    object: Handle<JsObject>,
) -> Result<KDF, ConversionError> {
    if let Some(argon_options) = js_result(object.get_opt::<JsObject, _, _>(cx, "Argon2d"))? {
        Ok(KDF::Argon2d(argon_options_from_object(cx, argon_options)?))
    } else if let Some(argon_options) = js_result(object.get_opt::<JsObject, _, _>(cx, "Argon2id"))?
    {
        Ok(KDF::Argon2id(argon_options_from_object(cx, argon_options)?))
    } else {
        Err(ConversionError::BadParameter)
    }
}
