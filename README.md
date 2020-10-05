# Max Path action

Check that no file path exceeds a limit.

Long file paths are an issue when developing on Windows, which has a
[260 character limit](https://docs.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation#enable-long-paths-in-windows-10-version-1607-and-later)
by default.

## Inputs

### `limit`

Maximum allowed file path length. Default `200`.

## Example usage

```
uses: graebm/max-path-action@v1
with:
  limit: 150
```
