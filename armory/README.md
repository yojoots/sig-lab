# (Old-style) Armory Signatures

## Overview

Here are a couple of python scripts that make generating and validating "Armory-style" Bitcoin signatures a little bit easier.

## Example Usage
#### Validation

```python3 validateSignature.py -m 'But can you explain this one?' -s deadbeef2f4a23b0f1954100b76bcb720f7b2ddc4a446dc06b8ffc4e143286e1e441f5f1583f300022ad3d134413a212581bcd36c20c7840d15b4d6b8e8f177f -k 0200000000000000000000003b78ce563f89a0ed9414f5aa28ad0d96d6795f9c63```

```python3 validateInputSignatureBitcoin.py -s test/example1.txt```


#### TODO:

- [ ] Add signMessage.py
- [ ] Add more tests/examples generated from signMessage.py