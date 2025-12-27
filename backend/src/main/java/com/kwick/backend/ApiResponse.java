package com.kwick.backend;

public class ApiResponse<T> {
    private boolean ok;
    private T body;
    private String error;

    public ApiResponse() {
    }

    public ApiResponse(T body) {
        this.ok = true;
        this.body = body;
    }

    public ApiResponse(String error) {
        this.ok = false;
        this.error = error;
    }

    public boolean isOk() {
        return ok;
    }

    public void setOk(boolean ok) {
        this.ok = ok;
    }

    public T getBody() {
        return body;
    }

    public void setBody(T body) {
        this.body = body;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
