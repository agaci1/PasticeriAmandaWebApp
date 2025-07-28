package com.amanda.pasticeri.dto;

import java.util.List;

public class CartOrderDto {
    private List<CartItem> items;
    private String name;
    private String surname;
    private String phone;
    private String email;

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public static class CartItem {
        private Long id;
        private String name;
        private double price;
        private String priceType;
        private int quantity;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
        public String getPriceType() { return priceType; }
        public void setPriceType(String priceType) { this.priceType = priceType; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
} 