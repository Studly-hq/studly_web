// Workaround for @hugeicons/react CJS build bug
// The package's CJS index.js incorrectly exports HugeiconsIcon.HugeiconsIcon instead of the component
// This wrapper imports from the correct CJS file that has the proper exports

import { HugeiconsIcon as HugeiconsIconComponent } from "../../node_modules/@hugeicons/react/dist/cjs/HugeiconsIcon.js";

export { HugeiconsIconComponent as HugeiconsIcon };