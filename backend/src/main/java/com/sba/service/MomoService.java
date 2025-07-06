package com.sba.service;

import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;
import com.sba.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class MomoService implements IMomoService{

    @Autowired
    private IOrderRepository iOrderRepository;

    @Value("${momo.partner-code}") private String partnerCode;
    @Value("${momo.access-key}") private String accessKey;
    @Value("${momo.secret-key}") private String secretKey;
    @Value("${momo.endpoint}") private String endpoint;
    @Value("${momo.redirect-url}") private String redirectUrl;
    @Value("${momo.ipn-url}") private String ipnUrl;

    @Override
    public String createPaymentUrl(Long orderId) {

        Order order = iOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        String requestId = UUID.randomUUID().toString();
        String orderInfo = String.valueOf(order.getOrderId());
        // Momo yêu cầu mỗi orderId phải là duy nhất
        String order_Id = UUID.randomUUID() + "-" + Instant.now().toString();
        String extraData = order.getAccount().getAccountName();
        Long amount = order.getTotalAmount().longValue();

        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + order_Id +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=captureWallet";


//        rawHash = "partnerCode=" + partnerCode +
//                "&accessKey=" + accessKey +
//                "&requestId=" + requestId +
//                "&amount=" + order.getTotalAmount() +
//                "&orderId=" + orderId +
//                "&orderInfo=" + orderInfo +
//                "&returnUrl=" + redirectUrl +
//                "&notifyUrl=" + ipnUrl +
//                "&extraData=" + order.getAccount().getAccountName();


        String signature = hmacSHA256(rawHash, secretKey);

        System.out.println("Signature: " + signature);

        Map<String, Object> body = new LinkedHashMap<>();

        body.put("partnerCode", partnerCode);
        body.put("accessKey", accessKey);
        body.put("requestId", requestId);
        body.put("amount", amount);
        body.put("orderId", order_Id);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", redirectUrl);
        body.put("ipnUrl", ipnUrl);
        body.put("extraData", extraData);
        body.put("requestType", "captureWallet");
        body.put("signature", signature);
        body.put("lang", "vi");

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, body, Map.class);

        Map<String, Object> resBody = response.getBody();
        // System.out.println("Momo API response: " + resBody);

        if (resBody == null || resBody.get("payUrl") == null) {
            throw new RuntimeException("Momo API failed or did not return payUrl. Full response: " + resBody);
        }

        return resBody.get("payUrl").toString();
    }

    private String hmacSHA256(String data, String key) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(),"HmacSHA256");
            hmac.init(secretKeySpec);
            byte[] hash = hmac.doFinal(data.getBytes());
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA256", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    @Override
    public String handlePayment(Map<String, String> payload) {

        if (payload == null || !payload.containsKey("orderId")) {
            throw new RuntimeException("Invalid payload: Missing orderId");
        }

        System.out.println("Received payload: " + payload.get("message"));

        if(!payload.get("message").toLowerCase().contains("thành công")) {
            throw new RuntimeException("Payment failed for order ");
        }

        Order order = iOrderRepository.findById(Long.parseLong(payload.get("orderInfo")))
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + payload.get("orderId")));

        order.setOrderStatus(OrderStatus.CONFIRMED);
        iOrderRepository.save(order);

        return "Payment status for order " + payload.get("orderId") + " is successful.";
    }
}
