<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Product; // Thêm import cho model Product
use Illuminate\Support\Facades\Storage; // Thêm import cho Storage facade
use Illuminate\Support\Facades\Validator; // Thêm import cho Validator facade

class AuthController extends Controller
{
    // Đăng nhập
    public function login(Request $request)
    {
        $email = $request->email;
        $password = $request->password;

        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        // Tạo token Sanctum
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng nhập thành công',
            'user' => $user,
            'role' => $user->role,
            'token' => $token, // Quan trọng: Trả về token cho frontend
        ]);
    }

    // Đăng ký
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ], [
            'username.max' => 'Họ tên không được vượt quá 255 ký tự.',
            'email.unique' => 'Email này đã được sử dụng.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'email.max' => 'Email không được vượt quá 255 ký tự.'
        ]);

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user',
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Đăng ký thành công',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi đăng ký',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Xóa người dùng
    public function deleteUser($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Xóa người dùng thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi xóa người dùng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Cập nhật thông tin người dùng
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy người dùng'
                ], 404);
            }

            $request->validate([
                'username' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            ], [
                'username.required' => 'Vui lòng nhập tên người dùng',
                'username.max' => 'Tên người dùng không được vượt quá 255 ký tự',
                'email.required' => 'Vui lòng nhập email',
                'email.email' => 'Email không hợp lệ',
                'email.max' => 'Email không được vượt quá 255 ký tự',
                'email.unique' => 'Email đã tồn tại trong hệ thống'
            ]);

            $user->username = $request->username;
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Cập nhật thông tin thành công',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi cập nhật thông tin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUser(Request $request) {
        try {
            return response()->json(User::all());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Lưu trữ một sản phẩm mới.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Tối đa 2MB
        ], [
            'name.required' => 'Vui lòng nhập tên sản phẩm.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'price.required' => 'Vui lòng nhập giá sản phẩm.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm không được nhỏ hơn 0.',
            'quantity.required' => 'Vui lòng nhập số lượng sản phẩm.',
            'quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
            'quantity.min' => 'Số lượng sản phẩm không được nhỏ hơn 0.',
            'image.image' => 'Tệp tải lên phải là hình ảnh.',
            'image.mimes' => 'Định dạng hình ảnh được hỗ trợ: jpeg, png, jpg, gif.',
            'image.max' => 'Kích thước hình ảnh không được vượt quá 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Lỗi xác thực', 'errors' => $validator->errors()], 400);
        }

        try {
            $productData = $request->except('image');
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public'); // Lưu trong storage/app/public/products
                $productData['image'] = Storage::url($imagePath); // Lấy URL công khai
            }

            $product = Product::create($productData);

            return response()->json(['status' => 'success', 'message' => 'Thêm sản phẩm thành công', 'product' => $product], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Có lỗi xảy ra khi thêm sản phẩm', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cập nhật thông tin của một sản phẩm cụ thể.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Tối đa 2MB
        ], [
            'name.required' => 'Vui lòng nhập tên sản phẩm.',
            'name.max' => 'Tên sản phẩm không được vượt quá 255 ký tự.',
            'price.required' => 'Vui lòng nhập giá sản phẩm.',
            'price.numeric' => 'Giá sản phẩm phải là số.',
            'price.min' => 'Giá sản phẩm không được nhỏ hơn 0.',
            'quantity.required' => 'Vui lòng nhập số lượng sản phẩm.',
            'quantity.integer' => 'Số lượng sản phẩm phải là số nguyên.',
            'quantity.min' => 'Số lượng sản phẩm không được nhỏ hơn 0.',
            'image.image' => 'Tệp tải lên phải là hình ảnh.',
            'image.mimes' => 'Định dạng hình ảnh được hỗ trợ: jpeg, png, jpg, gif.',
            'image.max' => 'Kích thước hình ảnh không được vượt quá 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => 'Lỗi xác thực', 'errors' => $validator->errors()], 400);
        }

        try {
            $productData = $request->except('image');
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ nếu có
                if ($product->image) {
                    Storage::disk('public')->delete(str_replace('/storage', '', $product->image));
                }
                $imagePath = $request->file('image')->store('products', 'public');
                $productData['image'] = Storage::url($imagePath);
            }

            $product->update($productData);

            return response()->json(['status' => 'success', 'message' => 'Cập nhật sản phẩm thành công', 'product' => $product], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy sản phẩm'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Có lỗi xảy ra khi cập nhật sản phẩm', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Xóa một sản phẩm cụ thể.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteProduct($id)
    {
        try {
            $product = Product::findOrFail($id);

            // Xóa ảnh cũ nếu có
            if ($product->image) {
                Storage::disk('public')->delete(str_replace('/storage', '', $product->image));
            }

            $product->delete();

            return response()->json(['status' => 'success', 'message' => 'Xóa sản phẩm thành công'], 204); // 204 No Content cho xóa thành công
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy sản phẩm'], 404);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Có lỗi xảy ra khi xóa sản phẩm', 'error' => $e->getMessage()], 500);
        }
    }
}