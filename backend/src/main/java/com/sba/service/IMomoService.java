package com.sba.service;

import java.util.Map;

public interface IMomoService {

    String createPaymentUrl(Long orderId);

    String handlePayment(Map<String, String> payload);

}
