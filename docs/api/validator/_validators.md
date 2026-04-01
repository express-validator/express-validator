#### `contains()`

```ts
contains(elem: any, options?: {
  ignoreCase?: boolean;
  minOccurrences?: number;
}): ValidationChain
```

#### `equals()`

```ts
equals(comparison: string): ValidationChain
```

#### `isAbaRouting()`

```ts
isAbaRouting(): ValidationChain
```

#### `isAfter()`

```ts
isAfter(dateOrOptions?: string | {
  comparisonDate?: string;
}): ValidationChain
```

#### `isAlpha()`

```ts
isAlpha(locale?: AlphaLocale, options?: {
  ignore?: string | string[] | RegExp;
}): ValidationChain
```

<details>
<summary>Possible values of AlphaLocale</summary>

- `'ar'`
- `'ar-AE'`
- `'ar-BH'`
- `'ar-DZ'`
- `'ar-EG'`
- `'ar-IQ'`
- `'ar-JO'`
- `'ar-KW'`
- `'ar-LB'`
- `'ar-LY'`
- `'ar-MA'`
- `'ar-QA'`
- `'ar-QM'`
- `'ar-SA'`
- `'ar-SD'`
- `'ar-SY'`
- `'ar-TN'`
- `'ar-YE'`
- `'az-AZ'`
- `'bg-BG'`
- `'bn-BD'`
- `'cs-CZ'`
- `'da-DK'`
- `'de-DE'`
- `'el-GR'`
- `'en-AU'`
- `'en-GB'`
- `'en-HK'`
- `'en-IN'`
- `'en-NZ'`
- `'en-US'`
- `'en-ZA'`
- `'en-ZM'`
- `'es-ES'`
- `'eo'`
- `'fa-AF'`
- `'fa-IR'`
- `'fi-FI'`
- `'fr-FR'`
- `'gu-IN'`
- `'he'`
- `'hi-IN'`
- `'hu-HU'`
- `'id-ID'`
- `'it-IT'`
- `'ja-JP'`
- `'kk-KZ'`
- `'kn-IN'`
- `'ko-KR'`
- `'ku-IQ'`
- `'ml-IN'`
- `'nb-NO'`
- `'nl-NL'`
- `'nn-NO'`
- `'or-IN'`
- `'pa-IN'`
- `'pl-PL'`
- `'pt-BR'`
- `'pt-PT'`
- `'ru-RU'`
- `'si-LK'`
- `'sk-SK'`
- `'sl-SI'`
- `'sr-RS'`
- `'sr-RS@latin'`
- `'sv-SE'`
- `'ta-IN'`
- `'te-IN'`
- `'th-TH'`
- `'tr-TR'`
- `'uk-UA'`
- `'vi-VN'`

</details>

#### `isAlphanumeric()`

```ts
isAlphanumeric(locale?: AlphanumericLocale, options?: {
  ignore?: string | RegExp;
}): ValidationChain
```

<details>
<summary>Possible values of AlphanumericLocale</summary>

- `'ar'`
- `'ar-AE'`
- `'ar-BH'`
- `'ar-DZ'`
- `'ar-EG'`
- `'ar-IQ'`
- `'ar-JO'`
- `'ar-KW'`
- `'ar-LB'`
- `'ar-LY'`
- `'ar-MA'`
- `'ar-QA'`
- `'ar-QM'`
- `'ar-SA'`
- `'ar-SD'`
- `'ar-SY'`
- `'ar-TN'`
- `'ar-YE'`
- `'az-AZ'`
- `'bg-BG'`
- `'bn-BD'`
- `'cs-CZ'`
- `'da-DK'`
- `'de-DE'`
- `'el-GR'`
- `'en-AU'`
- `'en-GB'`
- `'en-HK'`
- `'en-IN'`
- `'en-NZ'`
- `'en-US'`
- `'en-ZA'`
- `'en-ZM'`
- `'es-ES'`
- `'eo'`
- `'fa-AF'`
- `'fa-IR'`
- `'fi-FI'`
- `'fr-FR'`
- `'fr-BE'`
- `'gu-IN'`
- `'he'`
- `'hi-IN'`
- `'hu-HU'`
- `'it-IT'`
- `'id-ID'`
- `'ja-JP'`
- `'kk-KZ'`
- `'kn-IN'`
- `'ko-KR'`
- `'ku-IQ'`
- `'ml-IN'`
- `'nb-NO'`
- `'nl-BE'`
- `'nl-NL'`
- `'nn-NO'`
- `'or-IN'`
- `'pa-IN'`
- `'pl-PL'`
- `'pt-BR'`
- `'pt-PT'`
- `'ru-RU'`
- `'si-LK'`
- `'sk-SK'`
- `'sl-SI'`
- `'sr-RS'`
- `'sr-RS@latin'`
- `'sv-SE'`
- `'ta-IN'`
- `'te-IN'`
- `'th-TH'`
- `'tr-TR'`
- `'uk-UA'`
- `'vi-VN'`

</details>

#### `isAscii()`

```ts
isAscii(): ValidationChain
```

#### `isBase32()`

```ts
isBase32(options?: {
  crockford?: boolean;
}): ValidationChain
```

#### `isBase58()`

```ts
isBase58(): ValidationChain
```

#### `isBase64()`

```ts
isBase64(options?: {
  urlSafe?: boolean;
}): ValidationChain
```

#### `isBefore()`

```ts
isBefore(date?: string): ValidationChain
```

#### `isBIC()`

```ts
isBIC(): ValidationChain
```

#### `isBoolean()`

```ts
isBoolean(options?: {
  strict?: boolean;
  loose?: boolean;
}): ValidationChain
```

#### `isBtcAddress()`

```ts
isBtcAddress(): ValidationChain
```

#### `isByteLength()`

```ts
isByteLength(options: {
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
}): ValidationChain
```

#### `isCreditCard()`

```ts
isCreditCard(options?: {
  provider?: 'amex' | 'dinersclub' | 'discover' | 'jcb' | 'mastercard' | 'unionpay' | 'visa';
}): ValidationChain
```

#### `isCurrency()`

```ts
isCurrency(options?: {
  symbol?: string;
  require_symbol?: boolean;
  allow_space_after_symbol?: boolean;
  symbol_after_digits?: boolean;
  allow_negatives?: boolean;
  parens_for_negatives?: boolean;
  negative_sign_before_digits?: boolean;
  negative_sign_after_digits?: boolean;
  allow_negative_sign_placeholder?: boolean;
  thousands_separator?: string;
  decimal_separator?: string;
  allow_decimal?: boolean;
  require_decimal?: boolean;
  digits_after_decimal?: number[];
  allow_space_after_digits?: boolean;
}): ValidationChain
```

#### `isDataURI()`

```ts
isDataURI(): ValidationChain
```

#### `isDate()`

```ts
isDate(options?: {
  format?: string;
  delimiters?: string[];
  strictMode?: boolean;
}): ValidationChain
```

#### `isDecimal()`

```ts
isDecimal(options?: {
  decimal_digits?: string;
  force_decimal?: boolean;
  locale?: AlphanumericLocale;
  blacklisted_chars?: string;
}): ValidationChain
```

#### `isDivisibleBy()`

```ts
isDivisibleBy(number: number): ValidationChain
```

#### `isEAN()`

```ts
isEAN(): ValidationChain
```

#### `isEmail()`

```ts
isEmail(options?: {
  allow_display_name?: boolean;
  allow_underscores?: boolean;
  allow_utf8_local_part?: boolean;
  require_tld?: boolean;
  ignore_max_length?: boolean;
  allow_ip_domain?: boolean;
  domain_specific_validation?: boolean;
  blacklisted_chars?: string;
  host_blacklist?: (string | RegExp)[];
  host_whitelist?: (string | RegExp)[];
}): ValidationChain
```

#### `isEmpty()`

```ts
isEmpty(options?: {
  ignore_whitespace: boolean;
}): ValidationChain
```

#### `isEthereumAddress()`

```ts
isEthereumAddress(): ValidationChain
```

#### `isFQDN()`

```ts
isFQDN(options?: {
  require_tld?: boolean;
  allow_underscores?: boolean;
  allow_trailing_dot?: boolean;
  allow_numeric_tld?: boolean;
  allow_wildcard?: boolean;
  ignore_max_length?: boolean;
}): ValidationChain
```

#### `isFloat()`

```ts
isFloat(options?: {
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
  locale?: AlphanumericLocale;
}): ValidationChain
```

#### `isFreightContainerID()`

```ts
isFreightContainerID(): ValidationChain
```

#### `isFullWidth()`

```ts
isFullWidth(): ValidationChain
```

#### `isHalfWidth()`

```ts
isHalfWidth(): ValidationChain
```

#### `isHash()`

```ts
isHash(algorithm: HashAlgorithm): ValidationChain
```

<details>
<summary>Possible values of HashAlgorithm</summary>

- `'md4'`
- `'md5'`
- `'sha1'`
- `'sha256'`
- `'sha384'`
- `'sha512'`
- `'ripemd128'`
- `'ripemd160'`
- `'tiger128'`
- `'tiger160'`
- `'tiger192'`
- `'crc32'`
- `'crc32b'`

</details>

#### `isHexColor()`

```ts
isHexColor(): ValidationChain
```

#### `isHexadecimal()`

```ts
isHexadecimal(): ValidationChain
```

#### `isHSL()`

```ts
isHSL(): ValidationChain
```

#### `isIBAN()`

```ts
isIBAN(options?: {
  whitelist?: readonly IBANCode[];
  blacklist?: readonly IBANCode[];
}): ValidationChain
```

#### `isIdentityCard()`

```ts
isIdentityCard(locale?: IdentityCardLocale): ValidationChain
```

<details>
<summary>Possible values of IdentityCardLocale</summary>

- `'any'`
- `'ar-LY'`
- `'ar-TN'`
- `'ES'`
- `'FI'`
- `'he-IL'`
- `'hk-HK'`
- `'IN'`
- `'IT'`
- `'IR'`
- `'MZ'`
- `'NO'`
- `'PK'`
- `'PL'`
- `'TH'`
- `'zh-CN'`
- `'zh-TW'`

</details>

#### `isIMEI()`

```ts
isIMEI(options?: {
  allow_hyphens?: boolean;
}): ValidationChain
```

#### `isIP()`

```ts
isIP(version?: 4 | 6): ValidationChain
```

#### `isIPRange()`

```ts
isIPRange(version?: 4 | 6): ValidationChain
```

#### `isISBN()`

```ts
isISBN(versionOrOptions?: number | {
  version?: '10' | '13';
}): ValidationChain
```

#### `isISSN()`

```ts
isISSN(options?: {
  case_sensitive?: boolean;
  require_hyphen?: boolean;
}): ValidationChain
```

#### `isISIN()`

```ts
isISIN(): ValidationChain
```

#### `isISO6346()`

```ts
isISO6346(): ValidationChain
```

#### `isISO6391()`

```ts
isISO6391(): ValidationChain
```

#### `isISO8601()`

```ts
isISO8601(options?: {
  strict?: boolean;
  strictSeparator?: boolean;
}): ValidationChain
```

#### `isISO31661Numeric()`

```ts
isISO31661Numeric(): ValidationChain
```

#### `isISO31661Alpha2()`

```ts
isISO31661Alpha2(): ValidationChain
```

#### `isISO31661Alpha3()`

```ts
isISO31661Alpha3(): ValidationChain
```

#### `isISO4217()`

```ts
isISO4217(): ValidationChain
```

#### `isISO15924()`

```ts
isISO15924(): ValidationChain
```

#### `isISRC()`

```ts
isISRC(): ValidationChain
```

#### `isIn()`

```ts
isIn(values: readonly any[]): ValidationChain
```

#### `isInt()`

```ts
isInt(options?: {
  min?: number;
  max?: number;
  lt?: number;
  gt?: number;
  allow_leading_zeroes?: boolean;
}): ValidationChain
```

#### `isJSON()`

```ts
isJSON(options?: {
  allow_primitives?: boolean;
}): ValidationChain
```

#### `isJWT()`

```ts
isJWT(): ValidationChain
```

#### `isLatLong()`

```ts
isLatLong(options?: {
  checkDMS?: boolean;
}): ValidationChain
```

#### `isLength()`

```ts
isLength(options: {
  min?: number;
  max?: number;
}): ValidationChain
```

#### `isLicensePlate()`

```ts
isLicensePlate(locale: IsLicensePlateLocale): ValidationChain
```

<details>
<summary>Possible values of IsLicensePlateLocale</summary>

- `'cs-CZ'`
- `'de-DE'`
- `'de-LI'`
- `'en-NI'`
- `'en-PK'`
- `'en-SG'`
- `'es-AR'`
- `'fi-FI'`
- `'hu-HU'`
- `'pt-BR'`
- `'pt-PT'`
- `'sq-AL'`
- `'sv-SE'`
- `'any'`

</details>

#### `isLocale()`

```ts
isLocale(): ValidationChain
```

#### `isLowercase()`

```ts
isLowercase(): ValidationChain
```

#### `isLuhnNumber()`

```ts
isLuhnNumber(): ValidationChain
```

#### `isMagnetURI()`

```ts
isMagnetURI(): ValidationChain
```

#### `isMailtoURI()`

```ts
isMailtoURI(options?: {
  allow_display_name?: boolean;
  allow_underscores?: boolean;
  allow_utf8_local_part?: boolean;
  require_tld?: boolean;
  ignore_max_length?: boolean;
  allow_ip_domain?: boolean;
  domain_specific_validation?: boolean;
  blacklisted_chars?: string;
  host_blacklist?: (string | RegExp)[];
  host_whitelist?: (string | RegExp)[];
}): ValidationChain
```

#### `isMACAddress()`

```ts
isMACAddress(options?: {
  no_separators?: boolean;
  no_colons?: boolean;
  eui?: '48' | '64';
}): ValidationChain
```

#### `isMD5()`

```ts
isMD5(): ValidationChain
```

#### `isMimeType()`

```ts
isMimeType(): ValidationChain
```

#### `isMobilePhone()`

```ts
isMobilePhone(locale: MobilePhoneLocale | readonly Options.MobilePhoneLocale[], options?: {
  strictMode?: boolean;
}): ValidationChain
```

<details>
<summary>Possible values of MobilePhoneLocale</summary>

- `'any'`
- `'am-AM'`
- `'ar-AE'`
- `'ar-BH'`
- `'ar-DZ'`
- `'ar-EG'`
- `'ar-EH'`
- `'ar-IQ'`
- `'ar-JO'`
- `'ar-KW'`
- `'ar-LB'`
- `'ar-LY'`
- `'ar-MA'`
- `'ar-OM'`
- `'ar-QA'`
- `'ar-PS'`
- `'ar-SA'`
- `'ar-SD'`
- `'ar-SY'`
- `'ar-TN'`
- `'ar-YE'`
- `'az-AZ'`
- `'be-BY'`
- `'bg-BG'`
- `'bn-BD'`
- `'bs-BA'`
- `'cs-CZ'`
- `'de-AT'`
- `'de-CH'`
- `'de-DE'`
- `'de-LU'`
- `'da-DK'`
- `'dv-MV'`
- `'dz-BT'`
- `'el-CY'`
- `'el-GR'`
- `'en-AG'`
- `'en-AI'`
- `'en-AU'`
- `'en-BM'`
- `'en-BS'`
- `'en-BW'`
- `'en-CA'`
- `'en-GB'`
- `'en-GG'`
- `'en-GH'`
- `'en-GY'`
- `'en-HK'`
- `'en-HN'`
- `'en-IE'`
- `'en-IN'`
- `'en-JM'`
- `'en-KE'`
- `'en-KI'`
- `'en-KN'`
- `'en-LS'`
- `'en-MT'`
- `'en-MU'`
- `'en-MW'`
- `'en-NA'`
- `'en-NG'`
- `'en-NZ'`
- `'en-PG'`
- `'en-PH'`
- `'en-PK'`
- `'en-RW'`
- `'en-SG'`
- `'en-SL'`
- `'en-SS'`
- `'en-TZ'`
- `'en-UG'`
- `'en-US'`
- `'en-ZA'`
- `'en-ZM'`
- `'en-ZW'`
- `'es-AR'`
- `'es-BO'`
- `'es-CL'`
- `'es-CO'`
- `'es-CR'`
- `'es-CU'`
- `'es-DO'`
- `'es-EC'`
- `'es-ES'`
- `'es-GT'`
- `'es-HN'`
- `'es-MX'`
- `'es-NI'`
- `'es-PA'`
- `'es-PE'`
- `'es-PY'`
- `'es-SV'`
- `'es-UY'`
- `'es-VE'`
- `'et-EE'`
- `'fa-AF'`
- `'fa-IR'`
- `'fi-FI'`
- `'fj-FJ'`
- `'fo-FO'`
- `'fr-BE'`
- `'fr-BF'`
- `'fr-BJ'`
- `'fr-CD'`
- `'fr-CF'`
- `'fr-CH'`
- `'fr-CM'`
- `'fr-FR'`
- `'fr-GF'`
- `'fr-GP'`
- `'fr-MQ'`
- `'fr-PF'`
- `'fr-RE'`
- `'fr-WF'`
- `'ga-IE'`
- `'he-IL'`
- `'hu-HU'`
- `'id-ID'`
- `'ir-IR'`
- `'it-CH'`
- `'it-IT'`
- `'it-SM'`
- `'ja-JP'`
- `'ka-GE'`
- `'kk-KZ'`
- `'kl-GL'`
- `'ko-KR'`
- `'ky-KG'`
- `'lt-LT'`
- `'lv-LV'`
- `'mg-MG'`
- `'mk-MK'`
- `'mn-MN'`
- `'ms-MY'`
- `'my-MM'`
- `'mz-MZ'`
- `'nb-NO'`
- `'nl-AW'`
- `'nl-BE'`
- `'nl-NL'`
- `'ne-NP'`
- `'nn-NO'`
- `'pl-PL'`
- `'pt-AO'`
- `'pt-BR'`
- `'pt-PT'`
- `'ro-MD'`
- `'ro-RO'`
- `'ru-RU'`
- `'si-LK'`
- `'sk-SK'`
- `'sl-SI'`
- `'so-SO'`
- `'sq-AL'`
- `'sr-RS'`
- `'sv-SE'`
- `'tg-TJ'`
- `'th-TH'`
- `'tk-TM'`
- `'tr-TR'`
- `'uk-UA'`
- `'uz-Uz'`
- `'vi-VN'`
- `'zh-CN'`
- `'zh-HK'`
- `'zh-TW'`

</details>

#### `isMongoId()`

```ts
isMongoId(): ValidationChain
```

#### `isMultibyte()`

```ts
isMultibyte(): ValidationChain
```

#### `isNumeric()`

```ts
isNumeric(options?: {
  no_symbols: boolean;
  locale?: AlphanumericLocale;
}): ValidationChain
```

#### `isOctal()`

```ts
isOctal(): ValidationChain
```

#### `isPassportNumber()`

```ts
isPassportNumber(countryCode?: PassportCountryCode): ValidationChain
```

<details>
<summary>Possible values of PassportCountryCode</summary>

- `'AM'`
- `'AR'`
- `'AT'`
- `'AU'`
- `'AZ'`
- `'BE'`
- `'BG'`
- `'BY'`
- `'BR'`
- `'CA'`
- `'CH'`
- `'CN'`
- `'CY'`
- `'CZ'`
- `'DE'`
- `'DK'`
- `'DZ'`
- `'EE'`
- `'ES'`
- `'FI'`
- `'FR'`
- `'GB'`
- `'GR'`
- `'HR'`
- `'HU'`
- `'ID'`
- `'IE'`
- `'IN'`
- `'IR'`
- `'IS'`
- `'IT'`
- `'JM'`
- `'JP'`
- `'KR'`
- `'KZ'`
- `'LI'`
- `'LT'`
- `'LU'`
- `'LV'`
- `'LY'`
- `'MT'`
- `'MY'`
- `'MZ'`
- `'NL'`
- `'NZ'`
- `'PH'`
- `'PK'`
- `'PL'`
- `'PO'`
- `'PT'`
- `'RO'`
- `'RU'`
- `'SE'`
- `'SL'`
- `'SK'`
- `'TH'`
- `'TR'`
- `'UA'`
- `'US'`
- `'ZA'`

</details>

#### `isPort()`

```ts
isPort(): ValidationChain
```

#### `isPostalCode()`

```ts
isPostalCode(locale: PostalCodeLocale): ValidationChain
```

<details>
<summary>Possible values of PostalCodeLocale</summary>

- `'any'`
- `'AD'`
- `'AT'`
- `'AU'`
- `'AZ'`
- `'BA'`
- `'BD'`
- `'BE'`
- `'BG'`
- `'BR'`
- `'BY'`
- `'CA'`
- `'CH'`
- `'CN'`
- `'CO'`
- `'CZ'`
- `'DE'`
- `'DK'`
- `'DO'`
- `'DZ'`
- `'EE'`
- `'ES'`
- `'FI'`
- `'FR'`
- `'GB'`
- `'GR'`
- `'HR'`
- `'HT'`
- `'HU'`
- `'ID'`
- `'IL'`
- `'IN'`
- `'IR'`
- `'IS'`
- `'IT'`
- `'JP'`
- `'KE'`
- `'KR'`
- `'LI'`
- `'LK'`
- `'LT'`
- `'LU'`
- `'LV'`
- `'MT'`
- `'MX'`
- `'MY'`
- `'NL'`
- `'NO'`
- `'NP'`
- `'NZ'`
- `'PK'`
- `'PL'`
- `'PR'`
- `'PT'`
- `'RO'`
- `'RU'`
- `'SA'`
- `'SE'`
- `'SG'`
- `'SI'`
- `'SK'`
- `'TH'`
- `'TN'`
- `'TW'`
- `'UA'`
- `'US'`
- `'ZA'`
- `'ZM'`

</details>

#### `isRgbColor()`

```ts
isRgbColor(includePercentValues?: boolean): ValidationChain
```

#### `isRFC3339()`

```ts
isRFC3339(): ValidationChain
```

#### `isSemVer()`

```ts
isSemVer(): ValidationChain
```

#### `isSlug()`

```ts
isSlug(): ValidationChain
```

#### `isStrongPassword()`

```ts
isStrongPassword(options?: {
  minLength?: number;
  minLowercase?: number;
  minUppercase?: number;
  minNumbers?: number;
  minSymbols?: number;
  returnScore?: boolean;
  pointsPerUnique?: number;
  pointsPerRepeat?: number;
  pointsForContainingLower?: number;
  pointsForContainingUpper?: number;
  pointsForContainingNumber?: number;
  pointsForContainingSymbol?: number;
}): ValidationChain
```

#### `isSurrogatePair()`

```ts
isSurrogatePair(): ValidationChain
```

#### `isTaxID()`

```ts
isTaxID(locale: TaxIDLocale): ValidationChain
```

<details>
<summary>Possible values of TaxIDLocale</summary>

- `'bg-BG'`
- `'cs-CZ'`
- `'de-AT'`
- `'de-DE'`
- `'dk-DK'`
- `'el-CY'`
- `'el-GR'`
- `'en-CA'`
- `'en-GB'`
- `'en-IE'`
- `'en-US'`
- `'es-AR'`
- `'es-ES'`
- `'et-EE'`
- `'fi-FI'`
- `'fr-BE'`
- `'fr-FR'`
- `'fr-LU'`
- `'hr-HR'`
- `'hu-HU'`
- `'it-IT'`
- `'lb-LU'`
- `'lt-LT'`
- `'lv-LV'`
- `'mt-MT'`
- `'nl-BE'`
- `'nl-NL'`
- `'pl-PL'`
- `'pt-BR'`
- `'pt-PT'`
- `'ro-RO'`
- `'sk-SK'`
- `'sl-SI'`
- `'sv-SE'`
- `'uk-UA'`

</details>

#### `isTime()`

```ts
isTime(options: {
  hourFormat?: 'hour24' | 'hour12';
  mode?: 'default' | 'withSeconds';
}): ValidationChain
```

#### `isURL()`

```ts
isURL(options?: {
  require_tld?: boolean;
  allow_underscores?: boolean;
  allow_trailing_dot?: boolean;
  allow_numeric_tld?: boolean;
  allow_wildcard?: boolean;
  ignore_max_length?: boolean;
  protocols?: URLProtocol[];
  require_protocol?: boolean;
  require_host?: boolean;
  require_port?: boolean;
  require_valid_protocol?: boolean;
  host_whitelist?: (string | RegExp)[];
  host_blacklist?: (string | RegExp)[];
  allow_protocol_relative_urls?: boolean;
  disallow_auth?: boolean;
  validate_length?: boolean;
  max_allowed_length?: number;
  allow_fragments?: boolean;
  allow_query_components?: boolean;
}): ValidationChain
```

#### `isULID()`

```ts
isULID(): ValidationChain
```

#### `isUUID()`

```ts
isUUID(version?: UUIDVersion): ValidationChain
```

<details>
<summary>Possible values of UUIDVersion</summary>

- `1`
- `2`
- `3`
- `4`
- `5`
- `7`
- `'1'`
- `'2'`
- `'3'`
- `'4'`
- `'5'`
- `'7'`
- `'all'`
- `'loose'`

</details>

#### `isUppercase()`

```ts
isUppercase(): ValidationChain
```

#### `isVariableWidth()`

```ts
isVariableWidth(): ValidationChain
```

#### `isVAT()`

```ts
isVAT(countryCode: VATCountryCode): ValidationChain
```

<details>
<summary>Possible values of VATCountryCode</summary>

- `'GB'`
- `'IT'`
- `'NL'`
- `'AT'`
- `'BE'`
- `'BG'`
- `'HR'`
- `'CU'`
- `'CY'`
- `'CZ'`
- `'DK'`
- `'EE'`
- `'FI'`
- `'FR'`
- `'DE'`
- `'EL'`
- `'HU'`
- `'IE'`
- `'LV'`
- `'LT'`
- `'LU'`
- `'MT'`
- `'PL'`
- `'PT'`
- `'RO'`
- `'SK'`
- `'SI'`
- `'ES'`
- `'SE'`
- `'AL'`
- `'MK'`
- `'AU'`
- `'BY'`
- `'CA'`
- `'IS'`
- `'IN'`
- `'ID'`
- `'IL'`
- `'KZ'`
- `'NZ'`
- `'NG'`
- `'NO'`
- `'PH'`
- `'RU'`
- `'SM'`
- `'SA'`
- `'RS'`
- `'CH'`
- `'TR'`
- `'UA'`
- `'UZ'`
- `'AR'`
- `'BO'`
- `'BR'`
- `'CL'`
- `'CO'`
- `'CR'`
- `'EC'`
- `'SV'`
- `'GT'`
- `'HN'`
- `'MX'`
- `'NI'`
- `'PA'`
- `'PY'`
- `'PE'`
- `'DO'`
- `'UY'`
- `'VE'`

</details>

#### `isWhitelisted()`

```ts
isWhitelisted(chars: string | readonly string[]): ValidationChain
```

#### `matches()`

```ts
matches(pattern: RegExp | string, modifiers?: string): ValidationChain
```
