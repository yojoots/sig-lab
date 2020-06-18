from argparse import ArgumentParser
from ecdsa import SECP256k1, VerifyingKey
from hashlib import sha256
from os import path

parser = ArgumentParser()
parser.add_argument("-s", "--signature", help="signature")
parser.add_argument("-m", "--message", help="message or file containing message")
parser.add_argument("-k", "--key", help="key")
parser.add_argument("-a", "--address", help="address")
parser.add_argument("-n", "--noprepend", help="do not prepend 'Bitcoin Signed Message:' and newlines")
args = parser.parse_args()

if not args.signature:
    print("Need a signature in order to validate anything")
    exit()

components_dict = {}


def attempt_validation():
    try:
        vk = VerifyingKey.from_string(bytes.fromhex(components_dict["pubkey"]), curve=SECP256k1)
        if vk.verify(
            bytes.fromhex(components_dict["signature"]),
            sha256(str.encode(components_dict["message"])).digest(),
            hashfunc=sha256,
        ):
            print("\n\nValid Bitcoin Signature\n")
    except:
        print("\n\nInvalid signature\n")


def gather_components():
    if not args.message and not args.key:
        f = open(args.signature, "r")
        if f.mode == "r":
            full_contents = f.read().rstrip("\n")
        f.close()
        if not full_contents.startswith("-----BEGIN"):
            exit()
        current_component = "address"
        for idx, line in enumerate(full_contents.splitlines()):
            if idx == 0:
                continue
            if idx == 1:
                if not line.startswith("Address"):
                    exit()
            if idx == 2:
                if not line.startswith("Message"):
                    exit()
                components_dict[
                    "message"
                ] = """Bitcoin Signed Message:
""" + " ".join(
                    line.split(" ")[1:]
                ).lstrip(
                    '"'
                ).rstrip(
                    '"'
                )
                continue
            if idx > 2:
                if line.startswith("PublicKey"):
                    current_component = "pubkey"
                if line.startswith("Signature"):
                    current_component = "signature"
            if not line.startswith("-----END"):
                if current_component in components_dict:
                    components_dict[current_component] = components_dict[current_component] + line
                else:
                    components_dict[current_component] = line.split(" ")[1]
    else:
        try:
            if path.exists(args.message):
                f = open(args.message, "r")
                if f.mode == "r":
                    message = f.read().rstrip("\n")
                f.close()
            else:
                message = args.message.rstrip("\n")
            if not message.startswith("Bitcoin Signed Message:\n") and not args.noprepend:
                message = (
                    """Bitcoin Signed Message:
"""
                    + message
                )
            components_dict["message"] = message
            components_dict["pubkey"] = args.key
            components_dict["signature"] = args.signature
        except:
            print("Need a signature, message, and key (or a full signature file)")
            exit()


gather_components()
attempt_validation()
