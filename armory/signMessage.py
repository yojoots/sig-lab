import codecs
from argparse import ArgumentParser
from ecdsa import SECP256k1, VerifyingKey
from ecdsa import SigningKey, SECP256k1, VerifyingKey
from hashlib import sha256
from bitcoinlib.keys import Key
from os import path


ARMORY_STYLE_PREFIX = """Bitcoin Signed Message:
"""

parser = ArgumentParser()
parser.add_argument("-m", "--message", help="message or file containing message")
parser.add_argument("-k", "--key", help="key")
args = parser.parse_args()

if not args.message or not args.key:
    print("Need a message to sign and a key to sign with")
    exit()


def gather_and_sign():
    try:
        if path.exists(args.message):
            f = open(args.message, "r")
            if f.mode == "r":
                message = f.read().rstrip("\n")
            f.close()
        else:
            message = args.message.rstrip("\n")
        sign_message(message, bytes.fromhex(args.key))
    except Exception as e:
        print(e)
        exit()


def sign_message(message, private_key):
    if not message.startswith(ARMORY_STYLE_PREFIX):
        actually_signed_message = ARMORY_STYLE_PREFIX + message
    else:
        actually_signed_message = message
    hash_to_sign = sha256(str.encode(actually_signed_message)).digest()
    signing_key = SigningKey.from_string(private_key, curve=SECP256k1)
    signature = signing_key.sign(hash_to_sign, hashfunc=sha256)
    verifying_pubkey = signing_key.get_verifying_key()
    key_bytes = signing_key.to_string()
    key_hex = key_bytes.hex()
    full_signature_block = f"""-----BEGIN-SIGNATURE-BLOCK-------------------------------------
Address: {Key(private_key).address_uncompressed()}
Message: "{message}"
PublicKey: {verifying_pubkey.to_string("compressed").hex()}
Signature: {signature.hex()}
-----END-SIGNATURE-BLOCK---------------------------------------"""
    print(full_signature_block)


gather_and_sign()
