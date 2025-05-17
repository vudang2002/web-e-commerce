// Utility thực hiện cache đơn giản cho các API
import NodeCache from "node-cache";

// Tạo cache instance với thời gian mặc định là 60 giây
const cache = new NodeCache({ stdTTL: 60 });

export default cache;
