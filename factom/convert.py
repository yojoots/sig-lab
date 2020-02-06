import base58
import identitykeys
from hashlib import sha256
from sys import argv

# import factom_keys.fct as fct

try:
    user_input = argv[1]
    # This doesn't seem to work as expected:
    """
    factoid_private_key = fct.FactoidPrivateKey(seed_bytes=bytes.fromhex(user_input))
    print(f"FCT (private): {factoid_private_key.to_string()}")
    print(f"FCT (public):  {factoid_private_key.get_factoid_address().to_string()}")
    """
    fct_priv_pre_checksum = bytes.fromhex("6478") + bytes.fromhex(user_input)
    fct_priv_checksum = sha256(sha256(fct_priv_pre_checksum).digest()).digest()[:4]
    fct_priv_key = base58.b58encode(fct_priv_pre_checksum + fct_priv_checksum).decode()
    print(f"FCT (private): {fct_priv_key}")

    fct_pub_pre_checksum = bytes.fromhex("5fb1") + bytes.fromhex(user_input)
    fct_pub_checksum = sha256(sha256(fct_pub_pre_checksum).digest()).digest()[:4]
    fct_address = base58.b58encode(fct_pub_pre_checksum + fct_pub_checksum).decode()
    print(f"FCT (public):  {fct_address}")

    ec_priv_pre_checksum = bytes.fromhex("5db6") + bytes.fromhex(user_input)
    ec_priv_checksum = sha256(sha256(ec_priv_pre_checksum).digest()).digest()[:4]
    ec_priv_key = base58.b58encode(ec_priv_pre_checksum + ec_priv_checksum).decode()
    print(f"EC (private):  {ec_priv_key}")

    ec_pub_pre_checksum = bytes.fromhex("592a") + bytes.fromhex(user_input)
    ec_pub_checksum = sha256(sha256(ec_pub_pre_checksum).digest()).digest()[:4]
    ec_address = base58.b58encode(ec_pub_pre_checksum + ec_pub_checksum).decode()
    print(f"EC (public):   {ec_address}")

    id_private_key = identitykeys.PrivateIdentityKey(seed_bytes=bytes.fromhex(user_input))
    print(f"ID (private):  {id_private_key.to_string()}")
    print(f"ID (public):   {id_private_key.get_public_key().to_string()}")

except IndexError as e:
    print(e)
    print("Usage: python3 convert.py <private-key-hex>")
except AssertionError:
    print(f"Private key must be 32 bytes of hexadecimal. '{user_input}' is invalid.")
