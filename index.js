#!/usr/bin/env node
'use strict';

const program = require('commander');

const ed = require('ed25519-supercop');
const crypto = require('crypto');
const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;


program
	.version('0.0.1')
	.command('verify <signature> <body> <path> <publicKey>')
	.action((signature, body, path, publicKey) => {
		signedRequestValidator(signature, body, path, publicKey);
	});

program.parse(process.argv); // end with parse to parse through the input

function signedRequestValidator (signature, body, path, publicKey) {
	// Get the signature out of the headers and check it looks ok
	if (!signature) {
		return sendError(401, 'auth:signature:not provided', `No 'signature' header was supplied with the request`);
	}

	const publicKeyBuf = Buffer.from(publicKey, 'base64');

	const signatureClean = signature.replace(/\s+/g, '');
	if (!signatureClean.match(base64Regex)) {
		return sendError(401, 'auth:signature:encoding', `A signature was supplied but was incorrectly encoded`);
	}
	const signatureBuf = new Buffer(signatureClean, 'base64');
	if (signatureBuf.length !== 64) {
		return sendError(401, 'auth:signature:size', `A signature was supplied but has an incorrect length`);
	}

	let bodyBuf = Buffer.from(body);
	if (!Buffer.isBuffer(bodyBuf)) {
		if (bodyBuf !== Object(bodyBuf) || Object.keys(bodyBuf).length !== 0) {
			return sendError(500, 'auth:implementation', `The request body must be supplied as a Buffer but was not. This indicates an integration error. Are you using the raw body parser?`);
		}
		bodyBuf = new Buffer([]);
	}

	// Hash the body and url then concatinate them
	const pathHashBuf = crypto.createHash('sha256').update(path).digest();
	const bodyHashBuf = crypto.createHash('sha256').update(bodyBuf).digest();

	const combineHashBuf = Buffer.concat([pathHashBuf, bodyHashBuf]);

	// Verify the signature using the public key supplied
	const verified = ed.verify(signatureBuf, combineHashBuf, publicKeyBuf);

	if (!verified) {
		return sendError(403, 'auth:signature:invalid', `The signature supplied does not validate against the current public key`);
	}

	// Success
	success();
};


function sendError (code, type, description) {
	console.log({ valid: false, error: { code, type, description } });
	process.exit(1);
};

function success () {
	console.log({ valid: true });
	process.exit(0);
};
