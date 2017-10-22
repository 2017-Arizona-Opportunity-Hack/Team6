package com.example.geoffrey.foothillsanimalrescueapp;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import okhttp3.Callback;
import okhttp3.Call;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class DogList extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dog_list);
        try {
            run();
        } catch (Exception e) {
            e.printStackTrace();
        }

        RecyclerView recycle = (RecyclerView)findViewById(R.id.recycler_view);
    }

    private final OkHttpClient client = new OkHttpClient();
    String getResponse;
    HashMap<String, String> videos = new HashMap<String, String>();
    JSONObject json, test;
    JSONArray dog;
    String name, time, location, species, breed, weight, vacc_date, vacc_info;
    private ArrayList<String[]> dogList = new ArrayList<>();

    MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");

    public void run() throws Exception {
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

                getResponse = response.body().string();
//                Log.d(TAG,"OKHTTPTEST " + getResponse);
                System.out.println("Response: " + getResponse);

                returnDogs();
            }
        });
     }

    public int returnDogs(){
        try {
            dog = new JSONArray(getResponse);
            for(int j = 0; j < dog.length(); j++){
                test = dog.getJSONObject(j);
                JSONObject dogs = new JSONObject(test.getString("FosteredDog"));
                String[] dogInfo = new String[8];
                for(int i = 0; i < dogs.names().length(); i++){
                    name = dogs.getString("dogName");
                    dogInfo[0] = name;
                    time = dogs.getString("time_needed_by");
                    dogInfo[1] = time;
                    location = dogs.getString("location");
                    dogInfo[2] = location;
                    species = dogs.getString("species");
                    dogInfo[3] = species;
                    breed = dogs.getString("breed");
                    dogInfo[4] = breed;
                    weight = dogs.getString("weight");
                    dogInfo[5] = weight;
                    vacc_date = dogs.getString("vacc_date");
                    dogInfo[6] = vacc_date;
                    vacc_info = dogs.getString("vacc_info");
                    dogInfo[7] = vacc_info;
                    System.out.println("Foster: " + name + " " + time + " " + location);
                }
                dogList.add(dogInfo);
            }
        }
        catch (JSONException e) {
            e.printStackTrace();
        }
        return 0;
    }
}
