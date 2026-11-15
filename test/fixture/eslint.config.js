import { base } from "../../eslint/base.js";
import { react } from "../../eslint/react.js";

export default [...base({ tsconfigRootDir: import.meta.dirname }), ...react()];
