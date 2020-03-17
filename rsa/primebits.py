import Crypto.Util.number
from Crypto import Random
from sys import argv

num_bits=100

if (len(argv)>1):
    num_bits=int(argv[1])
if (len(argv)>2):
    try:
        M=int(argv[2])
    except:
        M = 0
        # Since this is only a toy demo, we're cutting corners here;
        # we use the character-sum of the string as a faux digest
        for ascii_char in argv[2]:
            M += ord(ascii_char)
else:
    M = 5

# Walk through Bill Buchanan's little example flow
print(f"Prime consists of {num_bits} bits")

p=Crypto.Util.number.getPrime(num_bits, randfunc=Crypto.Random.get_random_bytes)
print(f"\nRandom {num_bits}-bit Prime (p): {p}")

q=Crypto.Util.number.getPrime(num_bits, randfunc=Crypto.Random.get_random_bytes)
print(f"\nRandom {num_bits}-bit Prime (q): {q}")

N=p*q

print(f"\nN=p*q={N}")

PHI=(p-1)*(q-1)

print(f"\nPHI (p-1)(q-1)={PHI}")

e=65537
print(f"\ne={e}")
d=Crypto.Util.number.inverse(e,PHI)
print(f"d={d}")

print(f"\nCount of decimal digits (p): {len(str(p))}")
print(f"Count of decimal digits (N): {len(str(N))}")

print("\n\n=-=-= Using these keys... =-=-=")
print("\nRSA Message: ",M)
enc=pow(M,e,N)
print(f"RSA Cipher(c=M^e mod N): {enc}")
dec = pow(enc,d,N)
print(f"RSA Decipher (c^d mod N): {dec}")