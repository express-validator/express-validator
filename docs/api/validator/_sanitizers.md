#### `default()`

```ts
default(default_value: any): ValidationChain
```

#### `blacklist()`

```ts
blacklist(chars: string): ValidationChain
```

#### `escape()`

```ts
escape(): ValidationChain
```

#### `unescape()`

```ts
unescape(): ValidationChain
```

#### `ltrim()`

```ts
ltrim(chars?: string): ValidationChain
```

#### `normalizeEmail()`

```ts
normalizeEmail(options?: {
  all_lowercase?: boolean;
  gmail_lowercase?: boolean;
  gmail_remove_dots?: boolean;
  gmail_remove_subaddress?: boolean;
  gmail_convert_googlemaildotcom?: boolean;
  outlookdotcom_lowercase?: boolean;
  outlookdotcom_remove_subaddress?: boolean;
  yahoo_lowercase?: boolean;
  yahoo_remove_subaddress?: boolean;
  icloud_lowercase?: boolean;
  icloud_remove_subaddress?: boolean;
}): ValidationChain
```

#### `rtrim()`

```ts
rtrim(chars?: string): ValidationChain
```

#### `stripLow()`

```ts
stripLow(keep_new_lines?: boolean): ValidationChain
```

#### `toBoolean()`

```ts
toBoolean(strict?: boolean): ValidationChain
```

#### `toDate()`

```ts
toDate(): ValidationChain
```

#### `toFloat()`

```ts
toFloat(): ValidationChain
```

#### `toInt()`

```ts
toInt(radix?: number): ValidationChain
```

#### `trim()`

```ts
trim(chars?: string): ValidationChain
```

#### `whitelist()`

```ts
whitelist(chars: string): ValidationChain
```