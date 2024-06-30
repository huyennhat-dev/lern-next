// Khai báo hàm requiresToken nhận vào một tham số url dạng string
const requiresToken = (url: string) => {
  // Mảng các đường dẫn yêu cầu token
  const tokenRequiredPaths: string[] = [];

  // Hàm chuyển đổi đường dẫn thành biểu thức chính quy (regex)
  const pathToRegex = (path: string) => {
    // Thoát các ký tự đặc biệt trong đường dẫn để không bị lỗi regex
    const escapedPath = path.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    // Thay thế /:id bằng regex phù hợp để khớp với bất kỳ ký tự nào ngoại trừ dấu gạch chéo /
    const regexPath = escapedPath.replace(/\/:id/g, "/[^/]+");
    const finalRegexPath = regexPath.replace(/\/:path/g, "/.*");
    // Trả về một đối tượng RegExp khớp với đường dẫn
    return new RegExp(`^${finalRegexPath}$`);
  };

  // Kiểm tra xem url có khớp với bất kỳ đường dẫn nào yêu cầu token hay không
  return tokenRequiredPaths.some((path) => pathToRegex(path).test(url));
};

// Xuất hàm requiresToken để sử dụng ở nơi khác
export default requiresToken;
