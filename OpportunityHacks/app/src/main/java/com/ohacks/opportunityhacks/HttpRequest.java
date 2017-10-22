package com.ohacks.opportunityhacks;


import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.util.ArrayList;
import java.util.List;

import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.HttpResponse;
import cz.msebera.android.httpclient.NameValuePair;
import cz.msebera.android.httpclient.client.entity.UrlEncodedFormEntity;
import cz.msebera.android.httpclient.client.methods.HttpPost;
import cz.msebera.android.httpclient.cookie.Cookie;
import cz.msebera.android.httpclient.impl.client.DefaultHttpClient;
import cz.msebera.android.httpclient.message.BasicNameValuePair;
import cz.msebera.android.httpclient.protocol.HTTP;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Headers;
import okhttp3.JavaNetCookieJar;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 *
 */
public class HttpRequest {
    String URLSignup = "http://foothills.herokuapp.com/android_signup";
    String URLLogin = "http://foothills.herokuapp.com/android_login";
    String URLConfirm = "http://foothills.herokuapp.com/test_confirmed";

    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;

    CookieManager cManager;
    DefaultHttpClient httpClient;
    HttpPost httpPost;

    RequestSession session;
    RequestSessionMem sessionMem;

    OkHttpClient client;

    static List<String[]> dogList;

    // constructor
    public HttpRequest(SharedPreferences preferences){
        CookieManager cookieManager = new CookieManager();
        cookieManager.setCookiePolicy(CookiePolicy.ACCEPT_ALL);

        client = new OkHttpClient.Builder()
                .cookieJar(new JavaNetCookieJar(cookieManager))
                .build();

        httpClient = new DefaultHttpClient();
        sharedPreferences = preferences;

        final List<String[]> dogList;
    }
    // RUN SESSION TEST REQUEST

    public boolean runRequestSessionMem() {
        sessionMem = new RequestSessionMem();
        sessionMem.execute();
        return true;
    }

    class RequestSessionMem extends AsyncTask<String, Void, List<String[]>>{
        protected List<String[]> doInBackground(String... params){
            Request request = new Request.Builder()
                    .url("http://foothills.herokuapp.com/getDogList")
                    .build();

            client.newCall(request).enqueue(new Callback()
            {
                @Override public void onFailure(Call call, IOException e)
                {
                    e.printStackTrace();
                }

                @Override public void onResponse(Call call, Response response) throws IOException
                {
                    if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    String getResponse = response.body().string();
                    System.out.println("Response: " + getResponse);

                    returnDogs(getResponse);
                }
            });

            return null;
        }

        protected List<String[]> onPostExecute(String str){
            System.out.println("TESTING  " + str);
            return dogList;
        }

        public List<String[]> returnDogs(String getResponse){
           dogList = new ArrayList<String[]>();

            try {
                JSONArray dog = new JSONArray(getResponse);
                for(int j = 0; j < dog.length(); j++){
                    JSONObject test = dog.getJSONObject(j);
                    JSONObject dogs = new JSONObject(test.getString("FosteredDog"));
                    String[] dogInfo = new String[8];
                    for(int i = 0; i < dogs.names().length(); i++){
                        dogInfo[0] = dogs.getString("dogName");
                        dogInfo[1] = dogs.getString("time_needed_by");
                        dogInfo[2] = dogs.getString("location");
                        dogInfo[3] = dogs.getString("species");
                        dogInfo[4] = dogs.getString("breed");
                        dogInfo[5] = dogs.getString("weight");
                        dogInfo[6] = dogs.getString("vacc_date");
                        dogInfo[7] = dogs.getString("vacc_info");
                    }
                    dogList.add(dogInfo);
                }
            }
            catch (JSONException e) {
                e.printStackTrace();
            }
            return dogList;
        }
    }


    // ====================== LOGIN ASYNCTASK =============================

    public void login(String user, String pass){
        OkHttpRequest session = new OkHttpRequest(user, pass);
        session.execute();
    }

    // HttpRequest asynctask
    class OkHttpRequest extends AsyncTask<String, Void, String> {
        String name;
        String pass;
        String URL;

        boolean successful = false;

        public OkHttpRequest (String user, String pass){
            name = user;
            this.pass = pass;
            URL = URLLogin;
        }

        protected String doInBackground(String... urls){

            RequestBody formBody = new FormBody.Builder()
                    .add("username", name)
                    .add("password", pass)
                    .build();

            Request request = new Request.Builder()
                    .url(URL)
                    .post(formBody)
                    .build();

            try {
                Response response = client.newCall(request).execute();
                return response.body().string();
            } catch (Exception e){
                e.printStackTrace();
            }
            return "";
        }

        protected void onPostExecute(String str){
            //if cookies is empty, that is a problem
            System.out.println(str);
        }
    }

    //=================================================================

    // RUN LOGIN REQUEST

    public boolean runRequest(String user, String pass, int sign){
        session = new RequestSession(user, pass, sign);
        session.execute();
        return session.successful;
    }

    public boolean getSuccessful(){
        return session.successful;
    }


    // HttpRequest asynctask
    class RequestSession extends AsyncTask<String, Void, List<Cookie>> {
        String name;
        String pass;
        String URL;

        boolean successful = false;

        public RequestSession (String user, String pass, int sign){
            name = user;
            this.pass = pass;

            if (sign == 0)
                URL = URLSignup;
            else
                URL = URLLogin;

        }

        protected List<Cookie> doInBackground(String... urls){

            httpPost = new HttpPost(URL);
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            nvps.add(new BasicNameValuePair("username", name));
            nvps.add(new BasicNameValuePair("password", pass));

            List<Cookie> cookies = null;

            try {
                httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));

                HttpResponse response = httpClient.execute(httpPost);
                HttpEntity entity = response.getEntity();

                System.out.println("Login form get: " + response.getStatusLine());
                if (entity != null) {
                    entity.consumeContent();
                }

                // 401 means account does not exist
                if (response.getStatusLine().toString().contains("401"))
                    return cookies;

                cookies = httpClient.getCookieStore().getCookies();
                if (cookies.isEmpty()) {
                    System.out.println("No cookies found");
                } else {
                    // print out cookies
                    for (int i = 0; i < cookies.size(); i++) {
                        System.out.println("- " + cookies.get(i).toString());
                    }
                }
            } catch (Exception e){
                e.printStackTrace();
            }

            return cookies;
        }

        protected void onPostExecute(List<Cookie> cookies){
            //if cookies is empty, that is a problem
            if (cookies == null || cookies.isEmpty()) {
                successful = false;
                return;
            }

            editor = sharedPreferences.edit();

            String URL = cookies.get(0).toString();
            String[] split1 = URL.split("]");
            String currSplit = split1[2];
            String cookie = currSplit.substring(8, currSplit.length());

            // else store the cookie onto the shared preferences
            editor.putString("login_username", name);
            editor.putString("login_password", pass);
            editor.putString("login_cookie", cookie);

            editor.commit();
            successful = true;

            Log.e("COOKIE STORED", cookies.get(0).toString());
        }
    }


}
